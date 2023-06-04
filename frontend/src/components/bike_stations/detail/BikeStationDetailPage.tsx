import { useParams } from 'react-router-dom';
import { AppPage } from '../../common/AppPage';
import { useGetRequest } from '../../../common/hooks/useGetRequest';
import { BikeStation } from '../types';
import { CenteredLoader } from '../../common/Loader';
import { Spacer, SpacerDirection } from '../../common/Spacer';
import { MapSection } from './MapSection';
import { BasicInfoSection } from './BasicInfoSection';
import { StatisticsSection } from './StatisticsSection';
import { useContext, useEffect } from 'react';
import { NotificationContext, NotificationType } from '../../Notification';

export const BikeStationDetailPage = () => {
  const { id } = useParams();
  const { showNotification } = useContext(NotificationContext);

  const { loading, data, error } = useGetRequest<BikeStation>(`/bike-stations/${id}`);

  useEffect(() => {
    if (error) {
      showNotification('Something went wrong and bike station details could not be fetched', NotificationType.Error);
    }
  }, [error]);

  if (loading) return <CenteredLoader />;

  if (!data) return <p>Not found. TODO: Redirect</p>;

  return (
    <AppPage>
      <BasicInfoSection bikeStation={data} />
      <Spacer direction={SpacerDirection.Vertical} size={2} />
      <StatisticsSection bikeStationId={data.id} />
      <Spacer direction={SpacerDirection.Vertical} size={4} />
      <MapSection latitude={data.y} longitude={data.x} />
    </AppPage>
  );
};
