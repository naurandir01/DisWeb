import * as React from 'react';
import { InstantSearch, SearchBox, InfiniteHits,DynamicWidgets,HierarchicalMenu,RefinementList,Pagination,HitsPerPage,Hits } from 'react-instantsearch';
import searchClient from '../api/meili'; 
import 'instantsearch.css/themes/algolia.css';



export default function Meili() {
    return (
        <div>
        <InstantSearch indexName="artefacts" searchClient={searchClient}>
            <SearchBox/>
            <RefinementList attribute='plugin'/>
            <InfiniteHits hitComponent={Hit}/>
            <Pagination/>
        </InstantSearch>
        </div>
    );
}

const Hit = ({ hit }) => (
  <article key={hit.id}>
    <h1>{hit.source}</h1>
    <p>{hit.plugin}</p>
  </article>
);

