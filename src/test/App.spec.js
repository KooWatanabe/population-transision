import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import App from "../components/App";

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
    render(<App />, container);
  });

  expect(container.querySelector("input").value).toBe(
    fakeData.result[0].prefCode
  );
  expect(container.querySelector("label").textContent).toBe(
    fakeData.result[0].prefName
  );
  expect(pretty(container.innerHTML)).toMatchInlineSnapshot();

  const button = document.querySelector("input");

  const fakeData1 = {
    message: null,
    result: {
        "boundaryYear": 2015,
        "data": [{
            "label": "総人口",
            "data": [{
                "year": 1980,
                "value": 12817
            }]
        }]
    }
  };
  global.fetch = jest.fn().mockImplementation(setupFetchStub(fakeData1));
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeData1)
    })
  );

  await act(async () => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(pretty(container.innerHTML)).toMatchInlineSnapshot();

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
  global.fetch.mockClear();
  delete global.fetch;
});
