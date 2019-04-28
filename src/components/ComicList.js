import React, { Component } from 'react';
import ComicListItem from './ComicListItem';

const ComicList = function (props){
    const comicListItems = props.comics.map((comic) => {
        return <ComicListItem key={comic.id} comic={comic} />
    });

    return (
        <div className="release-list">
            {comicListItems}
        </div>
    )
}

export default ComicList;
