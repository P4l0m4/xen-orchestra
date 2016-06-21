import _ from 'messages'
import Component from 'base-component'
import Copiable from 'copiable'
import Icon from 'icon'
import Link from 'react-router/lib/Link'
import Page from '../page'
import React from 'react'
import { getUser } from 'selectors'
import { serverVersion } from 'xo'
import { Container, Row, Col } from 'grid'
import { connectStore, getXoaPlan } from 'utils'

import pkg from '../../../package'

const HEADER = <Container>
  <Row>
    <Col mediumSize={12}>
      <h2><Icon icon='menu-about' /> {_('aboutPage')} XO {getXoaPlan()}</h2>
    </Col>
  </Row>
</Container>

@connectStore(() => ({
  user: getUser
}))
export default class About extends Component {
  componentWillMount () {
    serverVersion.then(serverVersion => {
      this.setState({ serverVersion })
    })
  }
  render () {
    const { user } = this.props
    const isAdmin = user && user.permission === 'admin'

    return <Page header={HEADER}>
      <Container className='text-xs-center'>
        {isAdmin && <Row>
          <Col mediumSize={6}>
            <Icon icon='host' size={4} />
            <Copiable tagName='h4' data={`xo-server ${this.state.serverVersion}`}>
              xo-server {this.state.serverVersion || 'unknown'}
            </Copiable>
            <p className='text-muted'>Xen Orchestra server</p>
          </Col>
          <Col mediumSize={6}>
            <Icon icon='vm' size={4} />
            <Copiable tagName='h4' data={`xo-web ${pkg.version}`}>
              xo-web {pkg.version}</Copiable>
            <p className='text-muted'>Xen Orchestra web client</p>
          </Col>
        </Row>
      }
        {process.env.XOA_PLAN > 4
          ? <div>
            <Row>
              <Col>
                <h2 className='text-danger'>No pro support provided!</h2>
                <h4 className='text-danger'>Use in production at your own risks</h4>
                <p className='text-muted'>You can download our turnkey appliance on xen-orchestra.com</p>
              </Col>
            </Row>
            <Row>
              <Col mediumSize={6}>
                <a href='https://github.com/vatesfr/xo-web/issues/new'>
                  <Icon icon='bug' size={4} />
                  <h4>Bug Tracker</h4>
                </a>
                <p className='text-muted'>Issues? Report it!</p>
              </Col>
              <Col mediumSize={6}>
                <a href='https://xen-orchestra.com/forum'>
                  <Icon icon='group' size={4} />
                  <h4>Community</h4>
                </a>
                <p className='text-muted'>Join our community forum!</p>
              </Col>
            </Row>
          </div>
          : +process.env.XOA_PLAN === 1
            ? <div>
              <Row>
                <Col>
                  <Link to={'/xoa-update'}>
                    <h2>Free Trial for Premium Edition!</h2>
                    Request your trial now!
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col mediumSize={6}>
                  <a href='https://xen-orchestra.com/'>
                    <Icon icon='help' size={4} />
                    <h4>Any issue?</h4>
                  </a>
                  <p className='text-muted'>Problem? Contact us!</p>
                </Col>
                <Col mediumSize={6}>
                  <a href='https://xen-orchestra.com/docs'>
                    <Icon icon='user' size={4} />
                    <h4>Documentation</h4>
                  </a>
                  <p className='text-muted'>Read our official doc</p>
                </Col>
              </Row>
            </div>
          : <div>
            <Row>
              <Col>
                <h2 className='text-success'>Pro support included</h2>
                <a href='https://xen-orchestra.com/#!/member/products'>Acces your XO Account</a>
              </Col>
            </Row>
            <Row>
              <Col mediumSize={6}>
                <a href='https://xen-orchestra.com/#!/member/support'>
                  <Icon icon='help' size={4} />
                  <h4>Report a problem</h4>
                </a>
                <p className='text-muted'>Problem? Open a ticket !</p>
              </Col>
              <Col mediumSize={6}>
                <a href='https://xen-orchestra.com/docs'>
                  <Icon icon='user' size={4} />
                  <h4>Documentation</h4>
                </a>
                <p className='text-muted'>Read our official doc</p>
              </Col>
            </Row>
          </div>
        }
      </Container>
    </Page>
  }
}
