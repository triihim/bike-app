import { Journey } from './types';
import { usePage } from '../../common/hooks/usePage';
import { PaginationControls } from '../common/PaginationControls';
import { JourneyListItem } from './JourneyListItem';
import { Spacer, SpacerDirection } from '../common/Spacer';
import { HeadingWithLoader } from '../common/HeadingWithLoader';

export const JourneyListView = () => {
  const pageSize = 10;
  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount } = usePage<Journey>(
    pageSize,
    '/journey/page',
  );

  const showNoJourneysMessage = !loading && !page;
  const hasData = page !== null;

  const controls = (
    <PaginationControls
      onNext={nextPage}
      onPrevious={previousPage}
      nextDisabled={!hasMore || loading}
      previousDisabled={pageIndex === 1 || loading}
      currentPageIndex={pageIndex}
      totalPages={totalPageCount}
    />
  );

  return (
    <div>
      <HeadingWithLoader label="Journeys" loading={loading} />
      {showNoJourneysMessage && <p>No journeys available</p>}
      {controls}
      <Spacer direction={SpacerDirection.Vertical} size={1.5} />
      {hasData && page.data.map((journey) => <JourneyListItem key={journey.id} journey={journey} />)}
      <Spacer direction={SpacerDirection.Vertical} size={1.5} />
      {controls}
    </div>
  );
};
