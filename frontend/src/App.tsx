import { BikeStationListView } from './components/bike_stations/BikeStationListView';
import { AppLayout } from './components/common/AppLayout';
import { JourneyListView } from './components/journeys/JourneyListView';
import { TabGroup } from './components/common/TabGroup';

function App() {
  return (
    <AppLayout>
      <TabGroup
        tabs={[
          {
            label: 'Journeys',
            component: <JourneyListView />,
          },
          {
            label: 'Stations',
            component: <BikeStationListView />,
          },
        ]}
      />
    </AppLayout>
  );
}

export default App;
