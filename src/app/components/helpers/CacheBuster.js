import { Component } from 'react';
import PropTypes from 'prop-types';

// version from response - first param, local version second param
const semverGreaterThan = (versionA, versionB) => {
  const versionsA = versionA.split(/\./g);

  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());

    const b = Number(versionsB.shift());
    // eslint-disable-next-line no-continue
    if (a === b) continue;
    // eslint-disable-next-line no-restricted-globals
    return a > b || isNaN(b);
  }
  return false;
};

class CacheBuster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLatestVersion: false,
      refreshCacheAndReload: () => {
        console.log('Clearing cache and hard reloading...');
        if (caches) {
          // Service worker cache should be cleared with caches.delete()
          caches.keys().then((names) => {
            // delete browser cache and hard reload
            Promise.all((names.map(cache => caches.delete(cache))))
              .then(() => window.location.reload());
          });
        }
      },
    };
  }

  componentDidMount() {
    fetch('/static/meta.json')
      .then((response) => response.json())
      .then((meta) => {
        const currentVersion = process.env.REACT_APP_CURRENT_APP_VERSION;
        const latestVersion = meta.version;

        if (latestVersion && currentVersion) {
          const shouldForceRefresh = semverGreaterThan(latestVersion, currentVersion);
          if (shouldForceRefresh) {
            console.log(`We have a new version - ${latestVersion}. Should force refresh`);
            this.setState({ loading: false, isLatestVersion: false });
          } else {
            console.log(`You already have the latest version - ${latestVersion}. No cache refresh needed.`);
            this.setState({ loading: false, isLatestVersion: true });
          }
        }
      })
      .catch((errors) => {
        if (window) window.console.log(errors);
      });
  }

  render() {
    const { loading, isLatestVersion, refreshCacheAndReload } = this.state;
    const { children } = this.props;

    return children({ loading, isLatestVersion, refreshCacheAndReload });
  }
}

CacheBuster.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CacheBuster;
