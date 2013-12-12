# Async code is easier with fibers (light threads) and futures!
Fiber = require 'fibers'
Future = require 'fibers/future'

xmlrpc = require 'xmlrpc'

#=====================================================================

sleep = (ms) ->
  fiber = Fiber.current;
  setTimeout (-> fiber.run()), ms
  Fiber.yield()

#=====================================================================

# Note: All methods are synchroneous (using fibers), `.future()` may
# be used to make them asynchroneous.
class XAPI

  constructor: ({@host, @username, @password}) ->
    @connect()

  connect: (force = false) ->
    # Returns nothing if already connected to this host and not force.
    if !force and (@host is @xmlrpc?.options.host)
      return

    # Makes sure there is not session id left.
    delete @sessionId

    @xmlrpc = xmlrpc.createSecureClient {
      hostname: @host
      port: '443'
      rejectUnauthorized: false
    }

    @logIn()

  call: (method, args...) ->
    @connect() unless @xmlrpc

    args.unshift @sessionId if @sessionId

    do helper = =>
      future = new Future()
      @xmlrpc.methodCall method, args, future.resolver()

      try
        result = future.wait()

        # Returns the plain result if it does not have a valid XAPI format.
        return result unless result.Status?

        # Returns the result's value if all went well.
        return result.Value if result.Status is 'Success'

        # Something went wrong.
        error = result.ErrorDescription or value
      catch error # Catpture the error if it was thrown.

      # Gets the error code for transport errors and XAPI errors.
      code = error.code or error[0]

      switch code

        # XAPI sommetimes close the connection when the server is no
        # longer pool master (`event.next`), so we have to retry at
        # least once to know who is the new pool master.
        when 'ECONNRESET', \
             'ECONNREFUSED', \
             'HOST_STILL_BOOTING', \
             'HOST_HAS_NO_MANAGEMENT_IP'
          # Node.js seems to reuse the broken socket, so we add a small
          # delay.
          #
          # TODO Add a limit to avoid trying indefinitely.
          #
          # TODO Magic number!!!
          #
          # I would like to be able to use a shorter delay but for some
          # reason, when we connect to XAPI at a give moment, the
          # connection hangs.
          Fiber.sleep(500)
          helper()

        # XAPI is sometimes reinitialized and sessions are lost.
        # We try log in again if necessary.
        when 'SESSION_INVALID'
          @logIn()
          helper()

        # If the current host is a slave, changes the current host,
        # reconnect and retry.
        when 'HOST_IS_SLAVE'
          @host = error[1]
          @connect()
          helper()

        # This error has not been handled, just forwards it.
        else
          throw error

  logIn: ->
    @sessionId = @call 'session.login_with_password', @username, @password

#=====================================================================

module.exports = XAPI
