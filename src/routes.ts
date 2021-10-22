const pages = import.meta.globEager("./pages/**/*.tsx");

export const routes = Object.keys(pages).map(path => {
  const result = path.match(/\.\/pages\/(.*)\.tsx$/);

  if (result) {
    const route = result[1].toLowerCase();

    return {
      path: route === "index" ? "/" : `/${route.replace("/index", "")}`,
      component: pages[path].default,
      getServerSideProps: pages[path].getServerSideProps,
    };
  }

  throw new Error("Not found any page on pages/ folder");
});
