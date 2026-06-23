import { handleSearchAction } from '../../actions/search';
import Search from '../../components/Search/Search';
import SearchPersistence from '../../components/Search/SearchPersistence';
import Results from '../../components/Result/Results';
import ItemDetails from '../../components/ItemDetails/ItemDetails';
import CheckItemsFlyout from '../../components/CheckItemsFlyout/CheckItemsFlyout'; // Import here
import { ApiService } from '../../services/api.service';
import { redirect } from 'next/navigation';
import './page.css';

export default async function Home({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const params = await searchParams;
  const currentPage = params.page;

  if (currentPage === undefined || currentPage === '') {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        urlParams.set(key, value);
      }
    }
    urlParams.set('page', '1');
    redirect(`?${urlParams.toString()}`);
  }

  const query = typeof params.search === 'string' ? params.search : '';
  const pageNumber = Number(currentPage);

  const data = await ApiService.search(query, pageNumber - 1);

  return (
    <div className="home-container">
      <SearchPersistence />
      <CheckItemsFlyout />
      <header className="home-header">
        <Search initialValue={query} onSearchAction={handleSearchAction} />
      </header>
      <div className={`main-layout ${params.details ? 'has-details' : ''}`}>
        <section className="master-panel">
          <Results
            items={data.comicStrips ?? []}
            page={{ ...data.page, pageNumber: pageNumber - 1 }}
          />
        </section>

        {params.details && (
          <section className="outlet-panel">
            <ItemDetails uid={params.details as string} />
          </section>
        )}
      </div>
    </div>
  );
}
