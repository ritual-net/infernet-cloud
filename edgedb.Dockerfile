FROM edgedb/edgedb:5.6

# Files placed in /edgedb-bootstrap-late.d/ run after the initial database is created,
# and are intended for setting up the database schema and initial data.
# COPY /dbschema/bootstrap/auth.edgeql /edgedb-bootstrap-late.d/
