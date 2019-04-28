import React, { Component } from 'react';

class ComicsSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            term: ""
        };

    }

    render() {
        return (
            <div className="input-field nav-comic-search clearfix">
                <input id="header-search" type="text" />
                <a className="waves-effect waves-light btn">
                    <i className="material-icons left">search</i>
                </a>
            </div>
        )
    }
}

export default ComicsSearch;
