import { MultilayerIjump } from "algos/multi-layer-ijump/MultilayerIjump"
import { getDebugSvg } from "algos/infinite-grid-ijump-astar/tests/fixtures/get-debug-svg"
import { test, expect } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import type { SimpleRouteJson } from "solver-utils"

const input: SimpleRouteJson = {
  layerCount: 1,
  minTraceWidth: 0.15,
  bounds: {
    minX: -3,
    maxX: 3,
    minY: -4,
    maxY: 5,
  },
  obstacles: [
    {
      type: "rect",
      layers: ["top"],
      center: { x: 0, y: -3.1 },
      width: 4.0,
      height: 1.6,
      connectedTo: [],
    },
    {
      type: "rect",
      layers: ["top"],
      center: { x: -1.01, y: 1.2 },
      width: 0.6,
      height: 6.0,
      connectedTo: [],
    },
    {
      type: "rect",
      layers: ["top"],
      center: { x: -0.1, y: -2.0 },
      width: 0.6,
      height: 0.6,
      connectedTo: [],
    },
    {
      type: "rect",
      layers: ["top"],
      center: { x: -0.5, y: 4.0 },
      width: 0.4,
      height: 0.6,
      connectedTo: [],
    },
    {
      type: "rect",
      layers: ["top"],
      center: { x: 0.0, y: 4.0 },
      width: 0.4,
      height: 0.6,
      connectedTo: [],
    },
    {
      type: "rect",
      layers: ["top"],
      center: { x: 0.85, y: 1.5 },
      width: 0.6,
      height: 6.4,
      connectedTo: [],
    },
  ],
  connections: [
    {
      name: "conn1",
      pointsToConnect: [
        { x: -1.2, y: -2.0, layer: "top" },
        { x: 1.5, y: -2.0, layer: "top" },
      ],
    },
  ],
}

const inputCircuitJson: AnyCircuitElement[] = input.obstacles.map((obs, i) => ({
  type: "pcb_smtpad",
  pcb_smtpad_id: `pad_${i}`,
  pcb_component_id: "comp_0",
  shape: "rect",
  layer: "top",
  x: obs.center.x,
  y: obs.center.y,
  width: obs.width,
  height: obs.height,
}))

test("repro3: no wild trace jump towards distant top obstacles", () => {
  const autorouter = new MultilayerIjump({
    input,
    isRemovePathLoopsEnabled: true,
    debug: true,
  })

  const solution = autorouter.solveAndMapToTraces()
  expect(solution).toHaveLength(1)

  const route = solution[0].route
  for (const point of route) {
    if (point.route_type === "wire") {
      expect(point.y).toBeLessThan(0)
    }
  }

  expect(
    getDebugSvg({
      inputCircuitJson,
      autorouter,
      solution,
      rowHeight: 10,
    }),
  ).toMatchSvgSnapshot(import.meta.path)
})
