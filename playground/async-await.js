const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 2000);
  });
};
const doWork = async () => {
  const sum = await add(2, 6);
  const sum2 = await add(2, sum);
  const sum3 = await add(2, sum2);
  return sum3;
};
doWork()
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
