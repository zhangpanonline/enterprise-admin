<template>
  <div ref="el"></div>
</template>

<script setup lang="ts">
// 核心思路：不要一次性把几百万数据插入 DOM，而是分批次（比如每次渲染 1000 条），在 浏览器空闲时间 或 下一帧 继续渲染，避免阻塞主线程。
const el = useTemplateRef("el");

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

let time = 0

let list = [] as any;
worker.onmessage = (e) => {
  list = e.data;
  time = Date.now();
  renderChunk(list, el.value as HTMLElement);
};

function renderChunk(data: [], el: HTMLElement, chunkSize = 100) {
  let idx = 0;
  next();
  function next() {
    if (idx >= data.length) {
      console.log(`渲染 ${data.length} 条数据，耗时 ${(Date.now() - time)/1000} 秒`);
      return;
    }
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < chunkSize && idx < data.length; i++, idx++) {
      fragment.appendChild(createItem(data[idx]));
    }
    el.appendChild(fragment);

    // requestAnimationFrame(next);
    requestIdleCallback(next);
  }
}

function createItem(o: {
  id: string;
  name: string;
  age: string;
  address: string;
  createTime: string;
}): HTMLUListElement {
  const ul = document.createElement("ul");
  ul.setAttribute("class", "grid grid-cols-5");
  const id = document.createElement("li");
  id.textContent = o["id"];
  const name = document.createElement("li");
  name.textContent = o["name"];
  const age = document.createElement("li");
  age.textContent = o["age"];
  const address = document.createElement("li");
  address.textContent = o["address"];
  const createTime = document.createElement("li");
  createTime.textContent = o["createTime"];

  ul.appendChild(id);
  ul.appendChild(name);
  ul.appendChild(age);
  ul.appendChild(address);
  ul.appendChild(createTime);

  return ul;
}
</script>
