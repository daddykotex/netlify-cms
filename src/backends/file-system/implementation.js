import AuthenticationPage from './AuthenticationPage';

export default class TestRepo {
  constructor(config) {
    this.fsUrl = 'http://localhost:8888';
    this.config = config;
    this.b64EncodeUnicode = str => btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g, 
        (match, p1) => String.fromCharCode(`0x${ p1 }`)
        )
      );
    this.auth = null;
  }

  setUser() {}

  authComponent() {
    return AuthenticationPage;
  }

  authenticate(state) {
    const url = `${ this.fsUrl }/login`;
    const basicAuth = this.b64EncodeUnicode(`${ state.email }:${ state.password }`);
    return fetch(url, {
      headers: {
        Authorization: `Basic ${ basicAuth }`,
      },
    }).then((response) => {
      let resp;
      if (response.status === 401) {
        this.auth = null;
        resp = Promise.reject("invalid logon");
      } else if (response.status === 200) {
        this.auth = basicAuth;
        resp = { 
          email: state.email, 
          name: state.email,
        };
      } else {
        this.auth = null;
        resp = Promise.reject("unknown error");
      }
      return resp;
    });
  }

  getToken() {
    let res;
    if (this.auth) {
      res = Promise.resolve(this.auth);
    } else {
      res = Promise.reject('not logged');
    }
    return res;
  }

  entriesByFolder(collection, extension) {
    const folder = collection.get('folder');
    const url = `${ this.fsUrl }/api/entries?folder=${ folder }`;
    return fetch(url, {
      headers: {
        Authorization: `Basic ${ this.auth }`,
      },
    }).then(response => response.json());
  }

  entriesByFiles(collection) {
    const files = collection.get('files').map(collectionFile => ({
      path: collectionFile.get('file'),
      label: collectionFile.get('label'),
    }));

    const getFile = (file) => {
      const url = `${ this.fsUrl }/content/file?path=${ file.path }`;
      return fetch(url, {
        headers: {
          Authorization: `Basic ${ this.auth }`,
        },
      })
      .then(response => response.text())
      .then(body => ({
        file,
        data: body,
      }));
    };

    return Promise.all(files.map(getFile));
  }

  getEntry(collection, slug, path) {
    const url = `${ this.fsUrl }/content/file?path=${ path }`;
    return fetch(url, {
      headers: {
        Authorization: `Basic ${ this.auth }`,
      },
    }).then(response => response.text())
      .then(body => ({
        file: { path },
        data: body,
      }));
  }

  persistEntry(entry, mediaFiles = [], options) {
    const url = `${ this.fsUrl }/content/file?path=${ entry.path }`;
    return fetch(url, {
      method: 'POST',
      body: entry.raw,
      headers: {
        Authorization: `Basic ${ this.auth }`,
      },
    });
  }

}
