import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Prefecture from "../components/Prefecture";

let container = null;
function setupFetchStub(data) {
  return function fetchStub(_url) {
    return new Promise(resolve => {
      resolve({
        json: () =>
          Promise.resolve({
            data
          })
      });
    });
  };
}
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

it("スナップショット", async () => {
  const fakeData = {
    message: null,
    result: [
      {
        prefCode: "1",
        prefName: "北海道"
      }
    ]
  };
  global.fetch = jest.fn().mockImplementation(setupFetchStub(fakeData));
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeData)
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<Prefecture populations={{}} />, container);
  });

  expect(container.querySelector("input").value).toBe(
    fakeData.result[0].prefCode
  );
  expect(container.querySelector("label").textContent).toBe(
    fakeData.result[0].prefName
  );
  expect(pretty(container.innerHTML)).toMatchInlineSnapshot();

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
  global.fetch.mockClear();
  delete global.fetch;
});
