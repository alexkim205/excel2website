drop policy "User can get row" on "public"."dashboard_items";

drop policy "User can get row" on "public"."dashboards";

alter table "public"."dashboards" add column "subdomain" text;

CREATE UNIQUE INDEX dashboards_subdomain_key ON public.dashboards USING btree (subdomain);

alter table "public"."dashboards" add constraint "dashboards_subdomain_key" UNIQUE using index "dashboards_subdomain_key";

create policy "Everyone can get row"
on "public"."dashboard_items"
as permissive
for select
to public
using (true);


create policy "Everyone can get row"
on "public"."dashboards"
as permissive
for select
to public
using (true);



