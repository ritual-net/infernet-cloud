FROM edgedb/edgedb:4.7

# Files placed in /edgedb-bootstrap-late.d/ run after the initial database is created,
# and are intended for setting up the database schema and initial data.
COPY /dbschema/auth.edgeql /edgedb-bootstrap-late.d/
