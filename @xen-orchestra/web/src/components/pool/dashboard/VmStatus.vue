<template>
  <UiCard>
    <CardTitle>{{ $t('vms-status') }}</CardTitle>
    <DonutWithLegends :segments="segments" :icon />
    <CardNumbers label="Total" :value="vms.length" size="small" class="right" />
  </UiCard>
</template>

<script lang="ts" setup>
import DonutWithLegends from '@/components/DonutWithLegends.vue'
import CardTitle from '@core/components/card/CardTitle.vue'
import CardNumbers from '@core/components/CardNumbers.vue'
import UiCard from '@core/components/UiCard.vue'
import { faDesktop } from '@fortawesome/free-solid-svg-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const vms = [
  {
    id: '21eff025-8934-689f-945c-e4c959de1592',
    name_label: 'DTT Arch SPDK',
    power_state: 'Running',
    $container: '892d1dd4-a0af-4f71-9646-5c63d9644165',
    $pool: 'd12d9811-d74c-69fd-31c1-b416d0e2a536',
    other: {
      base_template_name: 'Debian Bullseye 11',
      import_task: 'OpaqueRef:fbc21c01-7af8-4929-9c4c-7e5c416e03d4',
      mac_seed: 'feb72c39-4991-275c-fa75-cd8860753d14',
      'install-methods': 'cdrom,nfs,http,ftp',
      linux_template: 'true',
    },
    href: '/rest/v0/vms/21eff025-8934-689f-945c-e4c959de1592',
  },
  {
    id: '5faf1cd9-3262-c3e3-8e2b-35f1308a0e44',
    name_label: 'DTT Alpine',
    power_state: 'Halted',
    $container: 'd12d9811-d74c-69fd-31c1-b416d0e2a536',
    $pool: 'd12d9811-d74c-69fd-31c1-b416d0e2a536',
    other: {
      import_task: 'OpaqueRef:7d71c4dc-d8c8-484b-a5f5-867d46f1ba5d',
      'xo:5faf1cd9':
        '{"creation":{"date":"2023-11-07T12:44:29.887Z","template":"4b6425be-728a-4a2c-8333-0aef209a348b","user":"f6745248-f0f6-4b4a-b879-dbb2e8ef6fcd"}}',
      base_template_name: 'CentOS 8',
      mac_seed: '1e0afe6e-4716-1124-41ad-713e522a82cd',
      'install-methods': 'cdrom,nfs,http,ftp',
      linux_template: 'true',
    },
    href: '/rest/v0/vms/5faf1cd9-3262-c3e3-8e2b-35f1308a0e44',
  },
  {
    id: '9bdf9570-46b4-da64-f135-20b5bdb200b7',
    name_label: 'DTT Arch udevsr',
    power_state: 'Halted',
    $container: 'd12d9811-d74c-69fd-31c1-b416d0e2a536',
    $pool: 'd12d9811-d74c-69fd-31c1-b416d0e2a536',
    other: {
      import_task: 'OpaqueRef:7d71c4dc-d8c8-484b-a5f5-867d46f1ba5d',
      'xo:9bdf9570':
        '{"creation":{"date":"2023-11-09T13:50:18.757Z","template":"07d91aaa-43f7-430a-bf84-0edb6714df0f","user":"f6745248-f0f6-4b4a-b879-dbb2e8ef6fcd"}}',
      base_template_name: 'Debian Bookworm 12',
      mac_seed: '0f55e6fc-9a5a-a497-8091-e3d2af5388e1',
      'install-methods': 'cdrom,nfs,http,ftp',
      linux_template: 'true',
    },
    href: '/rest/v0/vms/9bdf9570-46b4-da64-f135-20b5bdb200b7',
  },
]

const runningVms = computed(() => vms.filter(vm => vm.power_state === 'Running'))

const inactiveVms = computed(() => vms.filter(vm => vm.power_state === 'Halted'))

const unknownVms = computed(() => vms.filter(vm => vm.power_state !== 'Running' && vm.power_state !== 'Halted'))

const segments = computed(() => [
  {
    label: t('vms-running-status'),
    value: runningVms.value.length,
    color: 'success',
  },
  {
    label: t('vms-halted-status'),
    value: inactiveVms.value.length,
    color: 'dark-blue',
    tooltip: 'VMs with an inactive power state',
  },
  {
    label: t('vms-unknown-status'),
    value: unknownVms.value.length,
    color: 'disabled',
    tooltip: 'VMs with an unknown power state',
  },
])

const icon = faDesktop
</script>

<style lang="postcss" scoped>
.right {
  margin-left: auto;
}
</style>
