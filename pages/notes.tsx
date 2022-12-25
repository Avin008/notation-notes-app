import {
  CreateNoteCard,
  SearchbarFilter,
  NotesCard,
  SidebarLayout,
} from "../components";
import { notesData } from "../data";
import { useGetDoc } from "../hooks";
import {
  useFilterStore,
  useToggleNoteStore,
} from "../store";
import { Note } from "../types";
import {
  filterByLabel,
  filterByPrority,
  filterBySearchKey,
  sortByTime,
} from "../utility";

const NotesPage = (): React.ReactElement => {
  const { openCreateNoteModal } =
    useToggleNoteStore((store) => store);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
  } = useGetDoc("users");

  const {
    filter_by_priority,
    sort_by_time,
    filter_by_label,
    filter_by_search,
  } = useFilterStore((store) => store);

  if (isUserDataLoading)
    return <h1>loading...</h1>;

  return (
    <SidebarLayout>
      <div className="mx-auto mt-24 -translate-x-16 md:w-4/5 lg:w-1/2">
        <SearchbarFilter />
        <div className="mt-5 space-y-5">
          <h1 className="text-center font-semibold">
            Pinned Notes
          </h1>
          <div className="space-y-5">
            {userData.notes
              ?.filter(
                (x: Note) =>
                  x.pinned &&
                  !x.trash &&
                  !x.archive
              )
              .map((x: Note) => (
                <NotesCard
                  noteData={x}
                  userNotesData={userData.notes}
                />
              ))}
          </div>
        </div>
        <div className="mt-5 space-y-4">
          <h1 className="text-center font-semibold">
            Others Notes
          </h1>
          <div className="space-y-5">
            {filterBySearchKey(
              filter_by_search,
              filterByLabel(
                filter_by_label,
                sortByTime(
                  sort_by_time,
                  filterByPrority(
                    filter_by_priority,
                    userData.notes
                  )
                )
              )
            )
              .filter(
                (x) =>
                  !x.archive &&
                  !x.trash &&
                  !x.pinned
              )
              .map((x) => (
                <NotesCard
                  key={x.id}
                  noteData={x}
                  userNotesData={userData.notes}
                />
              ))}
          </div>
        </div>
        {openCreateNoteModal && (
          <CreateNoteCard />
        )}
      </div>
    </SidebarLayout>
  );
};

export default NotesPage;
