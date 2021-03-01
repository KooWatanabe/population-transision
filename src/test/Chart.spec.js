import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Chart from "../components/Chart";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("スナップショットテスト", () => {
  act(() => {
    const data = {
      1: {
        id: 1,
        name: "北海道",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
    };
    render(<Chart populations={data} />, container);
  });
  expect(pretty(container.innerHTML)).toMatchInlineSnapshot();

  act(() => {
    const data = {
      1: {
        id: 1,
        name: "北海道",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      },
      2: {
        id: 2,
        name: "青森県",
        data: [9, 8, 7, 6, 5, 4, 3, 2, 1]
      }
    };
    render(<Chart populations={data} />, container);
  });
  expect(pretty(container.innerHTML)).toMatchInlineSnapshot();
});
