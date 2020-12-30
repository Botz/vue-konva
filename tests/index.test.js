import { expect } from 'chai';
import './mocking';
import Konva from 'konva';
import sinon from 'sinon/pkg/sinon';
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils';
import VueKonva from '../src/index';

describe('Test references', function () {
  const Stage = {
    template: `
      <v-stage ref="stage">
      </v-stage>
    `,
  }
  it('create stage on mount', () => {
    const wrapper = mount(Stage, {
      global: {
        plugins: [VueKonva]
      }
    });
    const stage = wrapper.vm.$refs.stage.getStage();
    expect(stage).to.not.equal(undefined);
  });

  xit('Make sure it does not draw HTML', () => {
    const { vm } = mount({
      template: `
        <v-stage ref="stage">
        </v-stage>
      `,
    }, {
      global: {
        plugins: [VueKonva]
      }
    });
    const stage = vm.$refs.stage.getStage();
    expect(stage).to.not.equal(undefined);
  });

  xit('set initial stage size', () => {
    const { vm } = mount({
      template: `
        <v-stage ref="stage" :config="stage">
        </v-stage>
      `,
      data() {
        return {
          stage: {
            width: 300,
            height: 400,
          },
        };
      },
    }, {
      global: {
        plugins: [VueKonva]
      }
    });
    const stage = vm.$refs.stage.getStage();
    expect(stage.width()).to.equal(300);
    expect(stage.height()).to.equal(400);
  });

  xit('create layers', () => {
    const { vm } = mount({
      template: `
        <v-stage ref="stage" :config="stage">
          <v-layer ref="layer">
          </v-layer>
        </v-stage>
      `,
      data() {
        return {
          stage: {
            width: 300,
            height: 400,
          },
        };
      },
    }, {
      global: {
        plugins: [VueKonva]
      }
    });

    const stage = vm.$refs.stage.getStage();
    expect(stage.children.length).to.equal(1);

    const layer = vm.$refs.layer.getNode();
    expect(layer instanceof Konva.Layer).to.equal(true);
  });

  xit('Make sure it does not draw HTML', (done) => {
    const { vm } = mount({
      template: `
        <v-stage ref="stage" :config="stage">
          <v-layer ref="layer">
          </v-layer>
        </v-stage>
      `,
      data() {
        return {
          stage: {
            width: 300,
            height: 400,
          },
        };
      },
    }, {
      global: {
        plugins: [VueKonva]
      }
    });

    const stage = vm.$refs.stage.getStage();

    setTimeout(() => {
      const container = stage.container();

      expect(container.children.length).to.equal(1);
      done();
    }, 50);
  });
});

xdescribe('Test stage component', function () {
  it('can attach stage events', function () {
    let eventCount = 0;

    const { vm } = mount({
      template: `
        <v-stage ref="stage" :config="stage" @mousedown="handleMouseDown">
          <v-layer ref="layer">
            <v-rect/>
          </v-layer>
        </v-stage>
      `,
      data() {
        return {
          stage: {
            width: 300,
            height: 400,
          },
          rect: {
            width: 100,
            height: 100,
          },
        };
      },
      methods: {
        handleMouseDown() {
          eventCount += 1;
        },
      },
    });

    const stage = vm.$refs.stage.getStage();
    stage.simulateMouseDown({ x: 50, y: 50 });
    expect(eventCount).to.equal(1);
  });

  it('can attach stage content events', function () {
    let eventCount = 0;

    const { vm } = mount({
      template: `
        <v-stage ref="stage" :config="stage" @contentMousedown="handleMouseDown">
          <v-layer ref="layer">
            <v-rect/>
          </v-layer>
        </v-stage>
      `,
      data() {
        return {
          stage: {
            width: 300,
            height: 400,
          },
          rect: {
            width: 100,
            height: 100,
          },
        };
      },
      methods: {
        handleMouseDown() {
          eventCount += 1;
        },
      },
    });

    const stage = vm.$refs.stage.getStage();
    stage.simulateMouseDown({ x: 50, y: 50 });
    expect(eventCount).to.equal(1);
  });

  it('unmount stage should destroy it from Konva', async (done) => {
    const { vm } = mount({
      template: `
        <v-stage v-if="drawStage" ref="stage" :config="stage">
        </v-stage>
      `,
      data() {
        return {
          drawStage: true,
          stage: {
            width: 300,
            height: 400,
          },
        };
      },
    });

    const stagesNumber = Konva.stages.length;
    vm.drawStage = false;
    await nextTick()
    expect(Konva.stages.length).to.equal(stagesNumber - 1);
  });
});
