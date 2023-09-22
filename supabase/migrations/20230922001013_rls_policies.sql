create policy "Enable all for authenticated users only"
on "public"."dashboard_items"
as permissive
for all
to authenticated
with check (true);


create policy "Enable all for authenticated users only"
on "public"."dashboards"
as permissive
for all
to authenticated
with check (true);



