import './listPage.scss';
import Filter from '../../components/filter/Filter';
import Card from '../../components/card/Card';
import Map from '../../components/map/Map';
import { Await, useLoaderData } from 'react-router-dom';
import { Suspense } from 'react';

function ListPage() {
   const data = useLoaderData();
   return (
      <div className="listPage">
         <div className="listContainer">
            <div className="wrapper">
               <Filter />
               <Suspense fallback={<p>Loading...</p>}>
                  <Await
                     resolve={data.postResponse}
                     errorElement={<p>Error loading posts!</p>}
                  >
                     {(postResponse) =>
                        postResponse.data.map((item) => (
                           <Card key={item.id} item={item} />
                        ))
                     }
                  </Await>
               </Suspense>
            </div>
         </div>

         <Suspense fallback={<p>Loading...</p>}>
            <Await
               resolve={data.postResponse}
               errorElement={<p>Error loading posts!</p>}
            >
               {(postResponse) => (
                  <div className="mapContainer">
                     <Map items={postResponse.data} />
                  </div>
               )}
            </Await>
         </Suspense>
      </div>
   );
}

export default ListPage;
