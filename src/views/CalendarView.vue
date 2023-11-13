<template>
  <v-container class="ma-2">
    <v-row v-for="(seal, sindex) in sealList" :key="`seal-${seal.id}`">
      <v-col cols="1"></v-col>
      <v-col cols="1">
        <v-img :widht="50" :height="50" :src="seal.url.href"></v-img>
        <v-tooltip activator="parent" location="start">{{ `圖騰${seal.id}-${seal.name}` }}</v-tooltip>
      </v-col>
      <v-hover v-for="index in 13" :key="(sindex + 1) + (index - 1) * 20">
        <template v-slot:default="{ isHovering, props }">
          <v-col v-bind="props" :class="`${isHovering ? setHover(sindex + 1) : setColor(sindex + 1)}`"
            style="cursor: pointer;" class="d-flex align-center justify-center" @click="showVenusCalendar(sindex, index)">
            <div>
              <img :style="{ filter: isHovering ? 'invert(1' : 'invert(0)' }" style="height:25px"
                :src="getTone(sindex + 1 + (index - 1) * 20, 'url').href" />
              <p class="text-subtitle-1">{{ setSpace((sindex + 1) + (index - 1) * 20) }}</p>
            </div>
          </v-col>
        </template>
      </v-hover>
      <v-row>
      </v-row>
    </v-row>
  </v-container>
  <v-dialog v-model="openDialog" fullscreen>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ dialogTitle }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-item>
        <venusCalendar :seal="sealID" :tone="toneID"></venusCalendar>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>


<script>
import { ref } from 'vue'
import _ from 'lodash'
import { useSealList, useToneList } from '../utils/Info'
import venusCalendar from '../components/VenusCalendar.vue'
export default {
  components: {
    venusCalendar
  },
  setup() {
    const sealList = useSealList()
    const toneList = useToneList()
    const filterTone = ref(null)
    const filterID = ref(0)
    const openDialog = ref(false)
    const dialogTitle = ref('')
    const sealID = ref(0)
    const toneID = ref(0)
    return {
      sealList,
      toneList,
      filterTone,
      filterID,
      openDialog,
      dialogTitle,
      sealID,
      toneID
    }
  },
  methods: {
    filterCalendar(id) {
      const info = _.find(this.toneList, (v) => v.id == id)
      this.filterID = id
      if (_.isObject(info) && !_.isEmpty(info))
        this.filterTone = `調性${id}-${info.name}`
      else this.filterTone = ""
    },
    clearFilter() {
      this.filterTone = ""
      this.filterID = 0
    },
    getTone(num, key) {
      return _.find(this.toneList, (v) => v.id == (num % 13 == 0 ? 13 : num % 13))[key]
    },
    setSpace(num) {
      return _.padStart(num, 3, '0')
    },
    setHover(num) {
      switch (num % 4) {
        case 0:
          return 'bg-yellow-darken-4'
        case 1:
          return 'bg-red-darken-4'
        case 2:
          return 'bg-grey-darken-3'
        case 3:
          return 'bg-indigo-darken-4'
      }
    },
    setColor(num) {
      switch (num % 4) {
        case 0:
          return 'bg-yellow-lighten-3'
        case 1:
          return 'bg-red-lighten-4'
        case 2:
          return 'bg-white'
        case 3:
          return 'bg-indigo-lighten-4'
      }
    },
    showVenusCalendar(sindex, index) {
      this.sealID = sindex + 1
      const kinNum = this.sealID + (index - 1) * 20
      this.toneID = kinNum % 13 == 0 ? 13 : kinNum % 13
      const toneName = _.find(this.toneList, (v) => v.id == this.toneID)?.name ?? ''
      const sealName = _.find(this.sealList, (v) => v.id == this.sealID)?.name ?? ''
      this.dialogTitle = `Kin. ${kinNum} ${toneName}的${sealName}`
      this.openDialog = true
    },
    closeDialog() {
      this.openDialog = false
      this.dialogTitle = ''
      this.sealID = 0
      this.toneID = 0
    }
  }
}
</script>