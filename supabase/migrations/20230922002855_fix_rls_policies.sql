drop policy "Enable all for authenticated users only" on "public"."dashboard_items";

drop policy "Enable all for authenticated users only" on "public"."dashboards";

create policy "User can add row"
on "public"."dashboard_items"
as permissive
for insert
to authenticated
with check (true);


create policy "User can delete row"
on "public"."dashboard_items"
as permissive
for delete
to authenticated
using (true);


create policy "User can get row"
on "public"."dashboard_items"
as permissive
for select
to authenticated
using ((auth.uid() = "user"));


create policy "User can update row"
on "public"."dashboard_items"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "User can add row"
on "public"."dashboards"
as permissive
for insert
to authenticated
with check (true);


create policy "User can delete row"
on "public"."dashboards"
as permissive
for delete
to authenticated
using (true);


create policy "User can get row"
on "public"."dashboards"
as permissive
for select
to authenticated
using ((auth.uid() = "user"));


create policy "User can update row"
on "public"."dashboards"
as permissive
for update
to authenticated
using (true)
with check (true);



