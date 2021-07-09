# LazyGrids.jl
A Julia package for representing multi-dimensional grids

https://github.com/JuliaArrays/LazyGrids.jl

[![action status][action-img]][action-url]
[![pkgeval status][pkgeval-img]][pkgeval-url]
[![codecov][codecov-img]][codecov-url]
[![license][license-img]][license-url]
[![docs-stable][docs-stable-img]][docs-stable-url]
[![docs-dev][docs-dev-img]][docs-dev-url]
[![code-style][code-blue-img]][code-blue-url]

## Methods

This package exports the following methods:
* `ndgrid` : a "lazy" version of `ndgrid` that returns a tuple of
  `AbstractArray` objects essentially instantly with almost no memory allocated.
* `ndgrid_array` : return a traditional tuple of `Array` objects,
  which takes much longer to create and uses a lot of memory.
  It is not recommended but is included for comparison.

See the documentation linked in the blue badges above for examples,
and for a 1-line lazy version of `meshgrid`.

As shown in the examples, the lazy version typically is as fast,
if not faster, than using conventional dense `Array` objects.

## Example
```julia
julia> using LazyGrids
(xg, yg) = ndgrid(1:2, 3:0.5:4)
([1 1 1; 2 2 2], [3.0 3.5 4.0; 3.0 3.5 4.0])

julia> xg
2×3 LazyGrids.GridUR{Int64, 1, 2}:
 1  1  1
 2  2  2

julia> yg
2×3 LazyGrids.GridAR{Float64, 2, 2}:
 3.0  3.5  4.0
 3.0  3.5  4.0

julia> x = LinRange(-1,1,1001)
1001-element LinRange{Float64}: ...

julia> (xg, yg, zg) = ndgrid(x, x, x)
{... lots of output ...}

julia> size(xg) # show array dimensions
(1001, 1001, 1001)

julia> sizeof(xg) # show number of bytes used
40
```

## Related packages

* https://github.com/JuliaArrays/LazyArrays.jl
* https://github.com/mcabbott/LazyStack.jl
* https://github.com/ChrisRackauckas/VectorizedRoutines.jl
* https://github.com/JuliaArrays/RangeArrays.jl


<!-- URLs -->
[action-img]: https://github.com/JuliaArrays/LazyGrids.jl/workflows/CI/badge.svg
[action-url]: https://github.com/JuliaArrays/LazyGrids.jl/actions
[build-img]: https://github.com/JuliaArrays/LazyGrids.jl/workflows/CI/badge.svg?branch=main
[build-url]: https://github.com/JuliaArrays/LazyGrids.jl/actions?query=workflow%3ACI+branch%3Amain
[pkgeval-img]: https://juliaci.github.io/NanosoldierReports/pkgeval_badges/L/LazyGrids.svg
[pkgeval-url]: https://juliaci.github.io/NanosoldierReports/pkgeval_badges/L/LazyGrids.html
[code-blue-img]: https://img.shields.io/badge/code%20style-blue-4495d1.svg
[code-blue-url]: https://github.com/invenia/BlueStyle
[codecov-img]: https://codecov.io/github/JuliaArrays/LazyGrids.jl/coverage.svg?branch=main
[codecov-url]: https://codecov.io/github/JuliaArrays/LazyGrids.jl?branch=main
[docs-stable-img]: https://img.shields.io/badge/docs-stable-blue.svg
[docs-stable-url]: https://JuliaArrays.github.io/LazyGrids.jl/stable
[docs-dev-img]: https://img.shields.io/badge/docs-dev-blue.svg
[docs-dev-url]: https://JuliaArrays.github.io/LazyGrids.jl/dev
[license-img]: http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat
[license-url]: LICENSE
