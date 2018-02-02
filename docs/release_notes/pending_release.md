SMQTK Pending Release Notes
===========================


Updates / New Features since v0.8.1
-----------------------------------

General

- Added support for Python 3.

Travis CI

- Removed use of Miniconda installation since it wasn't being utilized in
  special way.

Descriptor Generator Plugins

* Fix issue with CaffeDescriptorGenerator where the GPU would not be
  appropriately used on a separate thread/process after initialization occurs on
  the main (or some other) thread.

Fixes since v0.8.1
------------------

Tests

- Fixed ambiguous ordering check in libsvm-hik implementation of
  RelevancyIndex algorithm.
