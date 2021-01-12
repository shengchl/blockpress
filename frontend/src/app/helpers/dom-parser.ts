const domParser = new window['DOMParser']();

export default function parser(param: string): string {
  const node = domParser['parseFromString'](`<!doctype html><body>${param}`, 'text/html');
  return node['body']['textContent'];
}
