import { createStore } from "lenrix";
import { Comment } from "react-loader-spinner";
import { delay, filter, first, map, of, pipe, switchMap } from "rxjs";
import { v4 as uuid } from "uuid";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { router } from "../../router/Router";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";

const route = router.examples.optimisticUpdates;

interface Comment {
  id: string;
  text: string;
}

interface DisplayedComment extends Comment {
  failed?: boolean;
}

interface CommentPostResult {
  comment: Comment;
  status: "OK" | "ERROR";
}

const commentsBackend = {
  list: () =>
    of([
      { id: uuid(), text: "Comment 1" },
      { id: uuid(), text: "Comment 2" },
    ]).pipe(delay(1500)),
  post: (comment: Comment) =>
    of(
      (comment.text.toLowerCase() === "error"
        ? { comment, status: "ERROR" }
        : { comment, status: "OK" }) as CommentPostResult
    ).pipe(delay(1000)),
};

interface State {
  commentInputValue: string;
  postedComments: Comment[];
  failedCommentIds: string[];
}

const initialState: State = {
  commentInputValue: "",
  postedComments: [],
  failedCommentIds: [],
};

const store = createStore(initialState)
  .load({
    loadedComments: route.match$.pipe(
      filter(Boolean),
      first(),
      switchMap(() => commentsBackend.list())
    ),
  })
  .computeFromFields(["loadedComments", "postedComments", "failedCommentIds"], {
    displayedComments: ({
      loadedComments,
      postedComments,
      failedCommentIds,
    }): DisplayedComment[] => [
      ...loadedComments,
      ...postedComments.map((comment) => ({
        ...comment,
        failed: failedCommentIds.includes(comment.id),
      })),
    ],
  })
  .actionTypes<{
    commentInputValueChanged: string;
    commentSubmitted: void;
    postComment: Comment;
    postCommentFailed: Comment;
  }>()
  .updates({
    commentInputValueChanged: (value) => (state) => ({
      ...state,
      commentInputValue: value,
    }),
    postComment: (comment) => (state) => ({
      ...state,
      commentInputValue: "",
      postedComments: [...state.postedComments, comment],
    }),
    postCommentFailed: (comment) => (state) => ({
      ...state,
      failedCommentIds: [...state.failedCommentIds, comment.id],
    }),
  })
  .epics((store) => ({
    commentSubmitted: pipe(
      map(() => store.currentData.commentInputValue),
      filter((text) => text.length > 0),
      map((text): Comment => ({ id: uuid(), text })),
      map((comment) => ({ postComment: comment }))
    ),
    postComment: pipe(
      switchMap((comment) => commentsBackend.post(comment)),
      filter(({ status }) => status === "ERROR"),
      map(({ comment }) => ({ postCommentFailed: comment }))
    ),
  }));

const Comments = loadableComponent(
  store.pick("displayedComments", "commentInputValue"),
  ({ displayedComments, commentInputValue }) => (
    <div style={{ width: 300, margin: "auto" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {displayedComments.map((comment) => (
          <li
            key={comment.text}
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            {comment.text}
            {comment.failed && (
              <div
                style={{ color: "red", fontStyle: "italic", marginTop: "10px" }}
              >
                Something wrong happened while posting the comment
              </div>
            )}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={commentInputValue}
        onChange={(e) =>
          store.dispatch({ commentInputValueChanged: e.target.value })
        }
        style={{ marginBottom: "10px", padding: "10px" }}
        placeholder="Add a comment..."
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            store.dispatch({ commentSubmitted: e.target.value });
          }
        }}
      />
      <div>Try typing "Error" !</div>
    </div>
  )
);

export const OptimisticUpdatesPage = () => (
  <Route match={route}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2>Optimistic Updates</h2>
      <Description />
      <Comments />
    </div>
  </Route>
);

const Description = () => (
  <ExampleDescription>
    <p>
      In this example, we start by loading the list of comments from the backend
    </p>
    <p>
      We also store a list of optimistically posted comments. Every time a
      comment is posted, it is directly added to this list, no questions asked.
      In the background though, we post the comment to the backend, and if an
      error occurs we add the comment id to a list of failed comment ids.
    </p>
    <p>
      Finally, we use those 3 values (loadedComments, postedComments and
      failedCommentIds) to compute the list of comments that will actually be
      displayed (that's our View Model)
    </p>
    <ExampleLink filename="OptimisticUpdates.tsx" />
  </ExampleDescription>
);
