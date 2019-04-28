import React, { Component } from 'react';

class ComicListItem extends Component {
    constructor (props) {
        super(props);
        this.state = {
            comic: props.comic
        };
    }

    render() {
        return (
            <div className="card">
                <div className="card-image">

                    <img src={this.state.comic.thumbnail.path + '.' + this.state.comic.thumbnail.extension} alt="Comic Image" />
                        <div className="bottom-title halfway-fab ">
                            <h5>{this.state.comic.title}</h5>
                        </div>
                </div>
                <div className="card-content">
                    <p>Price</p>
                </div>
            </div>
        )
    }
}

export default ComicListItem;
