import { createStore } from "lenrix";
import {
  combineLatestWith,
  delay,
  filter,
  first,
  map,
  mergeMap,
  of,
  pipe,
} from "rxjs";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { router } from "../../router/Router";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";

const route = router.examples.nestedRoutes;

export const NestedRoutesPage = () => (
  <Route match={route}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2>Nested Routes</h2>
      <Description />
      <AppPage />
    </div>
  </Route>
);

const appRoute = route.app;

const rootStore = createStore({}).load({
  loggedUser: appRoute.match$.pipe(
    filter(Boolean),
    first(),
    mergeMap(() => of({ name: "Bob" })),
    delay(1000)
  ),
});

const AppPage = loadableComponent(
  rootStore.pick("loggedUser"),
  ({ loggedUser }) => (
    <>
      <h3>Hello, {loggedUser.name}</h3>
      <ServiceListPage />
    </>
  )
);

const servicesRoute = appRoute.services;

const servicesStore = rootStore.load({
  serviceList: servicesRoute.match$.pipe(
    filter(Boolean),
    first(),
    mergeMap(() =>
      of([
        {
          id: "1",
          name: "Service 1",
          description: "Description for service 1",
        },
        {
          id: "2",
          name: "Service 2",
          description: "Description for service 2",
        },
        {
          id: "3",
          name: "Service 3",
          description: "Description for service 3",
        },
      ])
    ),
    delay(2000)
  ),
});

const serviceDetailRoute = servicesRoute.detail;

const ServiceListPage = () => (
  <Route match={servicesRoute}>
    <ServiceListPageContent />
  </Route>
);

const ServiceListPageContent = loadableComponent(
  servicesStore.pick("serviceList"),
  ({ serviceList }) => (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}
      >
        {serviceList.map((service) => (
          <button
            key={service.id}
            onClick={() => serviceDetailRoute.push({ serviceId: service.id })}
            style={{ width: 240 }}
          >
            {service.name}
          </button>
        ))}
      </div>
      <ServiceDetailPage />
    </>
  )
);

const serviceDetailStore = servicesStore.loadFromFields$(["serviceList"], {
  serviceDetail: pipe(
    map((_) => _.serviceList),
    combineLatestWith(
      serviceDetailRoute.match$.pipe(
        filter(Boolean),
        map(({ params }) => params.serviceId)
      )
    ),
    map(([serviceList, serviceId]) => {
      const service = serviceList.filter((_) => _.id === serviceId)[0];
      if (!service) throw new Error("No service found for ID " + serviceId);
      return service;
    })
  ),
});

const ServiceDetailPage = () => (
  <Route match={serviceDetailRoute}>
    <ServiceDetailPageContent />
  </Route>
);

const ServiceDetailPageContent = loadableComponent(
  serviceDetailStore.pick("serviceDetail"),
  ({ serviceDetail }) => (
    <div style={{ width: 360, margin: "auto" }}>
      <h3>Service Detail</h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>ID</div>
        <div>{serviceDetail.id}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>NAME</div>
        <div>{serviceDetail.name}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>DESCRIPTION</div>
        <div>{serviceDetail.description}</div>
      </div>
    </div>
  )
);

const Description = () => (
  <ExampleDescription>
    <p>
      This example demonstrates multiple nested pages and how to handle their
      associated routes.
    </p>
    <ul style={{ textAlign: "left" }}>
      <li>
        First, when entering the top-level route, we load the "loggedUser" and
        display its name.
      </li>
      <li>
        Also, when entering the "/services" route, we load a "serviceList" and
        display them a navigation buttons.
      </li>
      <li>
        When a button is clicked, we navigate to the "/services/:serviceId"
        route where we find and display the corresponding service in the loaded
        list .
      </li>
    </ul>
    <p>Have fun and try changing the "serviceId" URL param manually !</p>
    <ExampleLink filename="NestedRoutes.tsx" />
  </ExampleDescription>
);
