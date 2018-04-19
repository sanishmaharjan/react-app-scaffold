# React Component
React component split the UI into independent, reusable pieces. 
All react component are expected to be located at front-end/components.

## Creating React Components
- Example `demo.jsx`
```typescript jsx
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import UrlHelper from 'utilities/urlHelper';
import Output from 'components/output.jsx';

require('./demo.css');
export default class Demo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loadUrl: '',
            isDisableSubmit: false,
            eventData: null
        };
        this.store = context.store;
        this.urlFieldChange = this.urlFieldChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    urlFieldChange() {
        this.setState({
            loadUrl: this.urlField.value
        });
    }

    async submitHandler(event) {
        let self = this;
        event.preventDefault();
        this.setState({
            isDisableSubmit: true
        });

        try {
            let parameters = {
                loadUrl: this.state.loadUrl
            };

            let response = await axios({
                method: 'get',
                url: UrlHelper.apiBaseUrl() + '/webScrap',
                headers: {'Content-Type': 'application/json'},
                params: parameters
            });

            self.setState({
                isDisableSubmit: false,
                eventData: response.data
            });
        } catch (errorResponse) {
            this.setState({
                isDisableSubmit: false
            });

            let error = errorResponse.response ? errorResponse.response.data : errorResponse;
            self.store.notify('error', error.message);
        }
    }

    render() {
        return <div className="wrapper">
            <form onSubmit={this.submitHandler}>
                <p>
                    <label>Load Url</label>
                    <input type="text"
                        name="loadUrl"
                        autoFocus={true}
                        ref={(urlField) => {
                            this.urlField = urlField;
                        }}
                        onChange={this.urlFieldChange}
                        value={this.state.loadUrl}
                        required={true}
                        placeholder="web scraping Url"/>
                    <input type="submit" name="submit" disabled={this.state.isDisableSubmit}/>
                </p>
            </form>
            <div className="output">
                {this.state.eventData != null ? <Output eventData={this.state.eventData}/>: ''}
            </div>
        </div>;
    }
}

Demo.contextTypes = {
    store: PropTypes.object
};
```

- Example `topNav.jsx`
```typescript jsx
import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import UrlHelper from 'utilities/urlHelper';

require('./nav.css');   //load css
class TopNav extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.urlHelper = new UrlHelper();
    }

    linkClass = (path) => {
        return this.props.path === path ? 'active' : '';
    };

    render() {
        return (
            <nav>
                <ul className="title-section">
                    <li>
                        <a href={this.urlHelper.originPath() + '/openmrs'}>
                            <i className="fa fa-home" aria-hidden="true" />
                        </a>
                    </li>
                    <li>
                        <Link to={'/'} replace={this.props.path === '/'} className={this.linkClass('/')}>
                            {this.context.intl.formatMessage({id: 'HOME_PAGE'})}
                        </Link>
                    </li>
                    <li>
                        <Link to={'/blink'} replace={this.props.path === '/blink'} className={this.linkClass('/blink')}>
                            {this.context.intl.formatMessage({id: 'BLINK_PAGE'})}
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
}

TopNav.contextTypes = {
    router: PropTypes.object,
    intl: PropTypes.object
};

export default TopNav;

```

## Testing component
- Expected at `__tests__` directory.
- Example `topNav.spec.js`

```javascript
import React from 'react';
import {mount} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import {IntlProvider} from 'react-intl';

import TopNav from 'components/topNav';
import messages from 'i18n/messages';

require('utilities/__mocks__/location-mock');
const intlProvider = new IntlProvider({locale: 'en', messages: messages['en']}, {});
const {intl} = intlProvider.getChildContext();
const testData = {
    context: {
        router: {
            history: {
                action: 'PUSH',
                push: jest.fn(),
                replace: jest.fn(),
                go: jest.fn(),
                goBack: jest.fn(),
                goForward: jest.fn(),
                createHref: jest.fn(),
                block: jest.fn(),
                length: 1,
                location: {
                    hash: '/blink',
                    key: 'd0o5f3',
                    pathname: 'https://192.168.33.10/openmrs/owa/boilerplate/index.html',
                    search: ''
                }
            },
            route: {
                location: {
                    hash: '/blink',
                    key: 'd0o5f3',
                    pathname: '/openmrs/owa/boilerplate/index.html',
                    search: ''
                },
                match: {
                    isExact: true,
                    params: {},
                    path: '/blink',
                    url: '/blink'
                }
            }
        },
        intl: intl
    }
};

describe('TopNav', () => {
    it('renders correctly', () => {
        const topNav = mount(<TopNav path="/blink" />, {context: testData.context});

        expect(topNav.find('ul').find('li').length).toBe(3);
        expect(
            topNav
                .find('a.active')
                .text()
                .trim()
        ).toBe('Blink page');
        expect(shallowToJson(topNav)).toMatchSnapshot();
    });
});
```

## Mocking
- Expected at `__mocks__` directory.
- Example `location-mock.js` 
```javascript
Object.defineProperties(window.location, {
    host: {
        writable: true,
        value: '192.168.33.10'
    },
    hostname: {
        writable: true,
        value: '192.168.33.10'
    },
    href: {
        writable: true,
        value: 'https://192.168.33.10/openmrs/owa/boilerplate/index.html'
    },
    origin: {
        writable: true,
        value: 'https://192.168.33.10'
    },
    pathname: {
        writable: true,
        value: '/openmrs/owa/boilerplate/index.html'
    },
    port: {
        writable: true,
        value: ''
    },
    protocol: {
        writable: true,
        value: 'https:'
    }
});
```
