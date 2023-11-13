<template>
  <v-col v-resize="onResize">
    <canvas ref="kinCanvas"></canvas>
    <div ref="cssDiv"></div>
  </v-col>
</template>
<script>
import { ref } from 'vue'
import _ from 'lodash'
import { useSealList, useToneList } from '../utils/Info'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
export default {
  props: ['seal', 'tone'],
  setup(props) {
    const appbarH = 78
    const seal = props.seal
    const tone = props.tone
    const sealList = useSealList()
    const toneList = useToneList()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight - appbarH), 1, 750)
    const renderer = ref(null)
    const cssRenderer = ref(null)
    const controls = ref(null)
    const geometry = new THREE.CylinderGeometry(1, 1, 0.3, 20)
    const textureloader = new THREE.TextureLoader()
    return {
      appbarH,
      seal,
      tone,
      sealList,
      toneList,
      scene,
      camera,
      renderer,
      cssRenderer,
      controls,
      geometry,
      textureloader
    }
  },
  mounted() {
    this.scene.background = new THREE.Color(0xfafafa)
    this.renderCanvas()
  },
  methods: {
    onResize() {
      if (this.renderer) {
        this.camera.aspect = window.innerWidth / (window.innerHeight - this.appbarH)
        this.camera.updateMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight - this.appbarH)
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight - this.appbarH)
      }
    },
    getSealGlobel(id) {
      const sealHref = _.find(this.sealList, (v) => v.id == id)?.url?.href ?? ''
      const img = this.textureloader.load(sealHref)
      img.colorSpace = THREE.SRGBColorSpace
      const material = new THREE.MeshBasicMaterial({ map: img })
      const cylinder = new THREE.Mesh(this.geometry, material)
      cylinder.rotation.set(0, 20.5, 30, 'XYZ')
      return cylinder
    },
    getSealLabel(text) {
      const div = document.createElement('div')
      div.className = 'label'
      div.textContent = text
      div.style.color = 'black'
      div.style.backgroundColor = 'transparent'
      const label = new CSS2DObject(div)
      label.position.set(1.5, 0, 0)
      return label
    },
    setMainSeal() {
      const mainCylinder = this.getSealGlobel(this.seal)
      mainCylinder.position.set(0, 0)
      this.scene.add(mainCylinder)
    },
    setSupportSeal() {
      const supSealID = 19 - (this.seal == 20 ? 0 : this.seal)
      const supCylinder = this.getSealGlobel(supSealID == 0 ? 20 : supSealID)
      supCylinder.position.set(3, 0)
      this.scene.add(supCylinder)
      supCylinder.add(this.getSealLabel('支持'))
    },
    setChallengeSeal() {
      const challCylinder = this.getSealGlobel(this.seal > 10 ? this.seal - 10 : this.seal + 10)
      challCylinder.position.set(-3, 0)
      this.scene.add(challCylinder)
      challCylinder.add(this.getSealLabel('挑戰/拓展'))
    },
    setHideSeal() {
      const hideCylinder = this.getSealGlobel(21 - this.seal)
      hideCylinder.position.set(0, -3)
      this.scene.add(hideCylinder)
      hideCylinder.add(this.getSealLabel('隱藏推動'))
    },
    setIndexSeal() {
      let toneSet = 0
      switch (this.tone % 5) {
        case 1:
        default:
          toneSet = 0
          break
        case 2:
          toneSet = 3
          break
        case 3:
          toneSet = 1
          break
        case 4:
          toneSet = 4
          break
        case 0:
          toneSet = 2
          break
      }
      const indexSealID = (this.seal % 4 == 0 ? 4 : this.seal % 4) + (((Math.ceil(this.seal / 4) + toneSet) - 1) % 5) * 4
      const indexCylinder = this.getSealGlobel(indexSealID)
      indexCylinder.position.set(0, 3)
      this.scene.add(indexCylinder)
      indexCylinder.add(this.getSealLabel('指引'))
    },
    setPurposeSeal() {
      const purposeSealID = this.seal - this.tone + 1
      const purposeCylinder = this.getSealGlobel(purposeSealID < 0 ? purposeSealID + 20 : purposeSealID)
      purposeCylinder.position.set(-5, 3)
      this.scene.add(purposeCylinder)
      purposeCylinder.add(this.getSealLabel('目的'))
    },
    setMainTone() {
      const toneHref = _.find(this.toneList, (v) => v.id == this.tone)?.url?.href ?? ''
      const img = this.textureloader.load(toneHref)
      const toneGeometry = new THREE.CircleGeometry(0.3, 32)
      const meterial = new THREE.MeshBasicMaterial({ map: img })
      meterial.transparent = true
      const toneCircle = new THREE.Mesh(toneGeometry, meterial)
      toneCircle.rotation.set(0, 0, 0, 'XYZ')
      toneCircle.position.set(0, -1.3)
      this.scene.add(toneCircle)
    },
    renderCanvas() {
      const canvas = this.$refs.kinCanvas
      this.renderer = new THREE.WebGLRenderer({ canvas })
      this.renderer.setSize(window.innerWidth, window.innerHeight - this.appbarH)
      const cssDiv = this.$refs.cssDiv
      this.cssRenderer = new CSS2DRenderer({ element: cssDiv })
      this.cssRenderer.setSize(window.innerWidth, window.innerHeight - this.appbarH)
      this.cssRenderer.domElement.style.position = 'absolute'
      this.cssRenderer.domElement.style.top = `${this.appbarH}px`
      this.setMainSeal()
      this.setSupportSeal()
      this.setChallengeSeal()
      this.setHideSeal()
      this.setIndexSeal()
      this.setPurposeSeal()
      this.setMainTone()
      this.camera.position.z = 10
      this.controls = new OrbitControls(this.camera, this.cssRenderer.domElement)
      this.controls.enableDamping = true
      this.controls.minDistance = 1
      this.controls.maxDistance = 10
      this.controls.target.set(0.1, 0.1, 0.1)
      this.animate()
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      this.cssRenderer.render(this.scene, this.camera)
    }
  }
}
</script>
