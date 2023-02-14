var documenterSearchIndex = {"docs":
[{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"EditURL = \"https://github.com/JuliaArrays/LazyGrids.jl/blob/main/docs/lit/examples/1-ndgrid.jl\"","category":"page"},{"location":"generated/examples/1-ndgrid/#ndgrid","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"","category":"section"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"This page explains the ndgrid method(s) in the Julia package LazyGrids.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"This page comes from a single Julia file: 1-ndgrid.jl.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"You can access the source code for such Julia documentation using the 'Edit on GitHub' link in the top right. You can view the corresponding notebook in nbviewer here: 1-ndgrid.ipynb, or open it in binder here: 1-ndgrid.ipynb.","category":"page"},{"location":"generated/examples/1-ndgrid/#Setup","page":"LazyGrids ndgrid","title":"Setup","text":"","category":"section"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Packages needed here.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"using LazyGrids: ndgrid, ndgrid_array\nusing LazyGrids: btime, @timeo # not exported; just for timing tests here\nusing BenchmarkTools: @benchmark\nusing InteractiveUtils: versioninfo","category":"page"},{"location":"generated/examples/1-ndgrid/#Overview","page":"LazyGrids ndgrid","title":"Overview","text":"","category":"section"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"We begin with simple illustrations.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"The Julia method ndgrid_array in this package is comparable to Matlab's ndgrid function. It is given a long name here to discourage its use, because the lazy ndgrid version is preferable. The package provides ndgrid_array mainly for testing and timing comparisons.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"(xa, ya) = ndgrid_array(1.0:3.0, 1:2)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"xa","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"ya","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"This package provides a \"lazy\" version of ndgrid that appears to the user to be the same, but under the hood it is not storing huge arrays.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"(xl, yl) = ndgrid(1.0:3.0, 1:2)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"xl","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"yl","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"The following example illustrates the memory savings (thanks to Julia's powerful AbstractArray type):","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"(xl, yl) = ndgrid(1:100, 1:200)\n(xa, ya) = ndgrid_array(1:100, 1:200)\nsizeof(xl), sizeof(xa)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"One can do everything with a lazy array that one would expect from a \"normal\" array, e.g., multiplication and summation:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"sum(xl * xl'), sum(xa * xa')","category":"page"},{"location":"generated/examples/1-ndgrid/#Using-lazy-ndgrid","page":"LazyGrids ndgrid","title":"Using lazy ndgrid","text":"","category":"section"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Many applications with multiple variables involve evaluating functions over a grid of values.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"As a simple example (for illustration), one can numerically approximate the area of the unit circle by sampling that circle over a grid of x,y values, corresponding to numerical evaluation of the double integral   1_x^2 + y^2  1  dx  dy. There are many ways to implement this approximation in Julia, given a vector of x and y samples.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Δ = 1/2^10\nx = range(-1, stop=1, step=Δ)\ny = copy(x)\n\n@inline circle(x::Real, y::Real) = abs2(x) + abs2(y) < 1\n@inline circle(xy::NTuple{2}) = circle(xy...)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"The documentation below has many timing comparisons. The times in the Julia comments are on a 2017 iMac with Julia 1.6.1; the times printed out are whatever server GitHub actions uses. Using a trick to capture output, let's find out:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"io = IOBuffer()\nversioninfo(io)\nsplit(String(take!(io)), '\\n')","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"A basic double loop is the C/Fortran way. It uses minimal memory (only 48 bytes) but is somewhat slow.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"function method0(x,y) # basic double loop\n    sum = 0.0\n    for x in x, y in y\n        sum += circle(x,y)\n    end\n    return sum * Δ^2\nend\n\narea0 = method0(x,y)\nt = @benchmark method0($x,$y) # 10.5 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"The loop version does not look much like the math. It often seems natural to think of a grid of x,y values and simply sum over that grid, accounting for the grid spacing, using a function like this:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"area(xx,yy) = sum(circle.(xx,yy)) * Δ^2","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Users coming from Matlab who are unfamiliar with its newer broadcast capabilities might use an ndgrid of arrays, like in the following code, to compute the area. But this array approach is much slower and uses much more memory, so it does not scale well to higher dimensions.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"function area_array(x, y)\n    (xa, ya) = ndgrid_array(x, y)\n    return area(xa, ya)\nend\n@assert area_array(x, y) ≈ area0\nt = @benchmark area_array($x, $y) # 21.4 ms (11 allocations: 64.57 MiB)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"To be fair, one might have multiple uses of the grids xa,ya so perhaps they should be excluded from the timing. Separating that allocation makes the timing look faster, but it still uses a lot of memory, both for allocating the grids, and for the circle. broadcast in the area function above:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"(xa, ya) = ndgrid_array(x, y)\n@assert area(xa, ya) ≈ area0\nt = @benchmark area($xa, $ya) # 5.2 ms (7 allocations: 516.92 KiB)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"The main point of this package is to provide a lazy version of ndgrid that uses minimal memory.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"(xl, yl) = ndgrid(x, y)\n@assert xl == xa\n@assert yl == ya\nsizeof(xa), sizeof(xl)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Now there is essentially no memory overhead for the grids, but memory is still used for the circle. broadcast.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@assert area(xl,yl) ≈ area0\nt = @benchmark area($xl,$yl) # 3.7 ms (7 allocations: 516.92 KiB)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Furthermore, creating this lazy ndgrid is so efficient that we can include its construction time and still have performance comparable to the array version that had pre-allocated arrays.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"function area_lazy(x, y)\n    (xl, yl) = ndgrid(x, y)\n    return area(xl, yl)\nend\n@assert area_lazy(x, y) ≈ area0\nt = @benchmark area_lazy($x, $y) # 3.7 ms (7 allocations: 516.92 KiB)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/#More-details","page":"LazyGrids ndgrid","title":"More details","text":"","category":"section"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"The comparisons below here might be more for the curiosity of the package developers than for most users...","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"One can preallocate memory to store the circle. array, to avoid additional memory during the area calculation:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"out = Array{Float64}(undef, length(x), length(y))\nfunction area!(xx, yy)\n    global out .= circle.(xx,yy)\n    return sum(out) * Δ^2\nend\n@assert area!(xl,yl) ≈ area0\nt = @benchmark area!(xl,yl) # 4.8 ms (4 allocations: 128 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Interestingly, the lazy version is faster than the array version, presumably because of the overheard of moving data from RAM to CPU:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@assert area!(xa,ya) ≈ area0\nt = @benchmark area!(xa,ya) # 6.2 ms (4 allocations: 80 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"One can avoid allocating the output array by using a loop with CartesianIndices:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"function area_ci(xx, yy)\n    size(xx) == size(yy) || throw(\"size\")\n    sum = 0.0\n    @inbounds for c in CartesianIndices(xx)\n        sum += circle(xx[c], yy[c])\n    end\n    return sum * Δ^2\nend","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"With this approach the lazy version is a bit faster than the array version:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@assert area_ci(xl,yl) ≈ area0\nt = @benchmark area_ci(xl,yl) # 5.2 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@assert area_ci(xa,ya) ≈ area0\nt = @benchmark area_ci(xa,ya) # 5.9 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Alternatively one can use a linear index for loop, that also avoids the extra memory of circle. above, but is slower, especially for the lazy arrays that are optimized for Cartesian indexing:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"function area_for2(xx,yy)\n    size(xx) == size(yy) || throw(\"size\")\n    sum = 0.0\n    @inbounds for i in 1:length(xx)\n        sum += circle(xx[i], yy[i])\n    end\n    return sum * Δ^2\nend\n@assert area_for2(xa, ya) ≈ area0\nt = @benchmark area_for2($xa, $ya) # 5.9 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@assert area_for2(xl, yl) ≈ area0\nt = @benchmark area_for2($xl, $yl) # 15.4 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Some Julia users would recommend using broadcast. In this case, broadcast is reasonably fast, but still uses a lot of memory for the circle. output in the simplest implementation.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"areab(x,y) = sum(circle.(x,y')) * Δ^2\n@assert areab(x,y) ≈ area0\nt = @benchmark areab($x,$y) # 11.6 ms (7 allocations: 516.92 KiB)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Using zip can avoid the \"extra\" memory beyond the grids, but seems to have some undesirable overhead, presumably because zip uses linear indexing:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"areaz(xa, ya) = sum(circle, zip(xa,ya)) * Δ^2\n@assert areaz(xa, ya) ≈ area0\nt = @benchmark areaz($xa, $ya) # 3.9 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@assert areaz(xl, yl) ≈ area0\nt = @benchmark areaz($xl, $yl) # 12.2 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"One can also ensure low memory by using a product iterator, but the code starts to look pretty different from the math at this point and it is not much faster than broadcast here.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"areap(x,y) = sum(circle, Iterators.product(x, y)) * Δ^2\n@assert areap(x,y) ≈ area0\nt = @benchmark areap($x, $y) # 9.9 ms (3 allocations: 48 bytes)\nbtime(t)","category":"page"},{"location":"generated/examples/1-ndgrid/#D-case","page":"LazyGrids ndgrid","title":"3D case","text":"","category":"section"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"A 3D example is finding (verifying) the volume of a unit sphere.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"sphere(x::Real,y::Real,z::Real) = abs2(x) + abs2(y) + abs2(z) < 1\nsphere(r::NTuple) = sum(abs2, r) < 1","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Storing three 3D arrays of size 2049^3 Float64 would take 192GB, so already we must greatly reduce the sampling to use either broadcast or ndgrid_array. Furthermore, the broadcast requires annoying reshape steps:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Δc = 1/2^8 # coarse grid\nxc = range(-1, stop=1, step=Δc)\nyc = xc\nzc = xc\nnc = length(zc)\n3 * nc^3 * 8 / 1024^3 # GB prediction","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Here is broadcast in 3D (yuch!):","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"vol_br(x,y,z,Δ) = sum(sphere.(\n        repeat(x, 1, length(y), length(z)),\n        repeat(reshape(y, (1, :, 1)), length(x), 1, length(z)),\n        repeat(reshape(z, (1, 1, :)), length(x), length(y), 1),\n    )) * Δ^3\nvol_br([0.],[0.],[0.],Δc) # warm-up\n@timeo vol0 = vol_br(xc,yc,zc,Δc) # 2.7 sec, 3.0 GiB, roughly (4/3)π\n\nfunction vol_ci(xx, yy, zz, Δ)\n    size(xx) == size(yy) == size(zz) || throw(\"size\")\n    sum = 0.0\n    @inbounds for c in CartesianIndices(xx)\n        sum += sphere(xx[c], yy[c], zz[c])\n    end\n    return sum * Δ^3\nend","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Here is the lazy version:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"(xlc, ylc, zlc) = ndgrid(xc, yc, zc) # warm-up\n@timeo (xlc, ylc, zlc) = ndgrid(xc, yc, zc); # 0.000022 sec (1.8 KiB)\nnothing #hide","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"vol_ci([0.], [0.], [0.], Δc) # warm-up\n@timeo vol_ci(xlc, ylc, zlc, Δc) # 0.2 sec, 1.4 MiB","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Creating the grid of arrays itself is quite slow, even for the coarse grid:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"(xac, yac, zac) = ndgrid_array(xc, yc, zc) # warm-up\n@timeo (xac, yac, zac) = ndgrid_array(xc, yc, zc) # 1.8 sec 3.0GiB","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Once created, the array version is no faster than the lazy version:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@timeo vol_ci(xac, yac, zac, Δc) # 0.2 seconds (1.1 MiB)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Using zip is more concise (but slower):","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"vol_zip(xx, yy, zz, Δ) = sum(sphere, zip(xx,yy,zz)) * Δ^3","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"vol_zip([0.], [0.], [0.], Δc) # warm-up\n@timeo vol_zip(xlc, ylc, zlc, Δc) # 1.0 sec, 26 MiB","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Using zip for the array version seems to have less overhead so that is a potential for future improvement:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@assert vol_zip(xac, yac, zac, Δc) ≈ vol0\n@timeo vol_zip(xac, yac, zac, Δc) # 0.19 sec, 16 byte","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Importantly, with the lazy ndgrid now we can return to the fine scale; it takes a few seconds, but it is feasible because of the low memory.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"z = copy(x)\n@timeo (xlf, ylf, zlf) = ndgrid(x, y, z) # 0.000023 sec","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@timeo vol_ci(xlf, ylf, zlf, Δ) # 12.7 sec, 16 bytes","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"I was hoping that with a lazy grid, now we could explore higher-dimensional spheres.  But with the current zip overhead it was too slow, even with coarse grid.","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"@timeo (π^2/2, sum(sphere, zip(ndgrid(xc,xc,xc,xc)...)) * Δc^4)","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"Probably I need to learn more about stuff like pairs(IndexCartesian(), A) e.g., this PR. Another day...","category":"page"},{"location":"generated/examples/1-ndgrid/#Reproducibility","page":"LazyGrids ndgrid","title":"Reproducibility","text":"","category":"section"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"This page was generated with the following version of Julia:","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"using InteractiveUtils: versioninfo\nio = IOBuffer(); versioninfo(io); split(String(take!(io)), '\\n')","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"And with the following package versions","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"import Pkg; Pkg.status()","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"","category":"page"},{"location":"generated/examples/1-ndgrid/","page":"LazyGrids ndgrid","title":"LazyGrids ndgrid","text":"This page was generated using Literate.jl.","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"EditURL = \"https://github.com/JuliaArrays/LazyGrids.jl/blob/main/docs/lit/examples/2-copyto.jl\"","category":"page"},{"location":"generated/examples/2-copyto/#copyto","page":"copyto! test","title":"copyto! test","text":"","category":"section"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"This page examines copyto! speed of the lazy grids in the Julia package LazyGrids.","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"This page comes from a single Julia file: 2-copyto.jl.","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"You can access the source code for such Julia documentation using the 'Edit on GitHub' link in the top right. You can view the corresponding notebook in nbviewer here: 2-copyto.ipynb, or open it in binder here: 2-copyto.ipynb.","category":"page"},{"location":"generated/examples/2-copyto/#Setup","page":"copyto! test","title":"Setup","text":"","category":"section"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"Packages needed here.","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"using LazyGrids: ndgrid, ndgrid_array\nusing LazyGrids: btime, @timeo # not exported; just for timing tests here\nusing BenchmarkTools: @benchmark\nusing InteractiveUtils: versioninfo","category":"page"},{"location":"generated/examples/2-copyto/#Overview","page":"copyto! test","title":"Overview","text":"","category":"section"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"There are several sub-types of AbstractGrids. Here we focus on the simplest (using OneTo) and the most general (AbstractVector).","category":"page"},{"location":"generated/examples/2-copyto/#OneTo","page":"copyto! test","title":"OneTo","text":"","category":"section"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"dims = (2^7,2^8,2^9)\n\n(xl, _, _) = ndgrid(dims...) # lazy version\nxa = Array(xl) # regular dense Array\nout = zeros(Int, dims)\nsizeof.((xl, xa))","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"ta = @benchmark copyto!(out, xa) # 12.6ms\nbtime(ta)","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"tl = @benchmark copyto!(out, xl) # 27.3ms\nbtime(tl)","category":"page"},{"location":"generated/examples/2-copyto/#AbstractVector","page":"copyto! test","title":"AbstractVector","text":"","category":"section"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"x,y,z = map(rand, dims)\n\n(xl, _, _) = ndgrid(dims...)\nxa = Array(xl)\nout = zeros(eltype(x), dims)\nsizeof.((xl, xa))","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"ta = @benchmark copyto!(out, xa) # 15.7ms\nbtime(ta)","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"tl = @benchmark copyto!(out, xl) # 21.7ms\nbtime(tl)","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"These results suggest that copyto! is somewhat slower for a lazy grid than for an Array. This drawback could be reduced or possibly even eliminated by adding a dedicated copyto! method for lazy grids. Submit an issue or PR if there is a use case that needs faster copyto!.","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"See broadcasting.","category":"page"},{"location":"generated/examples/2-copyto/#Reproducibility","page":"copyto! test","title":"Reproducibility","text":"","category":"section"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"This page was generated with the following version of Julia:","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"using InteractiveUtils: versioninfo\nio = IOBuffer(); versioninfo(io); split(String(take!(io)), '\\n')","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"And with the following package versions","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"import Pkg; Pkg.status()","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"","category":"page"},{"location":"generated/examples/2-copyto/","page":"copyto! test","title":"copyto! test","text":"This page was generated using Literate.jl.","category":"page"},{"location":"methods/#Methods-list","page":"Methods","title":"Methods list","text":"","category":"section"},{"location":"methods/","page":"Methods","title":"Methods","text":"","category":"page"},{"location":"methods/#Methods-usage","page":"Methods","title":"Methods usage","text":"","category":"section"},{"location":"methods/","page":"Methods","title":"Methods","text":"Modules = [LazyGrids]","category":"page"},{"location":"methods/#LazyGrids.LazyGrids","page":"Methods","title":"LazyGrids.LazyGrids","text":"LazyGrids\n\nModule for representing grids in a lazy way.\n\n\n\n\n\n","category":"module"},{"location":"methods/#LazyGrids.AbstractGrid","page":"Methods","title":"LazyGrids.AbstractGrid","text":"AbstractGrid{T,d,D} <: AbstractArray{T,D}\n\nAbstract type for representing the dth component of of a D-dimensional ndgrid(v₁, v₂, ...) where 1 ≤ d ≤ D and where eltype(v_d) = T.\n\n\n\n\n\n","category":"type"},{"location":"methods/#LazyGrids.GridAR","page":"Methods","title":"LazyGrids.GridAR","text":"GridAR{T,d,D} <: AbstractGrid{T,d,D}\n\nThe dth component of D-dimensional ndgrid(v₁, v₂, ...) where 1 ≤ d ≤ D and v_d is an AbstractRange.\n\n\n\n\n\n","category":"type"},{"location":"methods/#LazyGrids.GridAV","page":"Methods","title":"LazyGrids.GridAV","text":"GridAV{T,d,D} <: AbstractGrid{T,d,D}\n\nThe dth component of D-dimensional ndgrid(v₁, v₂, ...) where 1 ≤ d ≤ D and v_d is an AbstractVector.\n\n\n\n\n\n","category":"type"},{"location":"methods/#LazyGrids.GridOT","page":"Methods","title":"LazyGrids.GridOT","text":"GridOT{T,d,D} <: AbstractArray{T,D}\n\nThe dth component of D-dimensional ndgrid(1:M, 1:N, ...) where 1 ≤ d ≤ D.\n\n\n\n\n\n","category":"type"},{"location":"methods/#LazyGrids.GridSL","page":"Methods","title":"LazyGrids.GridSL","text":"GridSL{T,d,D} <: AbstractGrid{T,d,D}\n\nThe dth component of D-dimensional ndgrid(v₁, v₂, ...) where 1 ≤ d ≤ D and v_d is a StepRangeLen.\n\n\n\n\n\n","category":"type"},{"location":"methods/#LazyGrids.GridUR","page":"Methods","title":"LazyGrids.GridUR","text":"GridUR{T,d,D} <: AbstractGrid{T,d,D}\n\nThe dth component of D-dimensional ndgrid(a:b, c:d, ...) where 1 ≤ d ≤ D.\n\n\n\n\n\n","category":"type"},{"location":"methods/#LazyGrids.btime-Tuple{Any}","page":"Methods","title":"LazyGrids.btime","text":"btime(t ; unit::Symbol, digits::Int)\n\nPretty-print the @benchmark output for non-interactive use with Literate. Returns a string so that Literate will capture the output.\n\nunit is :ms by default, for reporting in ms.  Or use μs.\ndigits is 1 by default.\n\n\n\n\n\n","category":"method"},{"location":"methods/#LazyGrids.ndgrid-Tuple{Int64, Vararg{Int64}}","page":"Methods","title":"LazyGrids.ndgrid","text":"(xg, yg, ...) = ndgrid(M, N, ...)\n\nShorthand for ndgrid(1:M, 1:N, ...).\n\nExample\n\njulia> ndgrid(2,3)\n([1 1 1; 2 2 2], [1 2 3; 1 2 3])\n\n\n\n\n\n","category":"method"},{"location":"methods/#LazyGrids.ndgrid-Tuple{Vararg{AbstractVector}}","page":"Methods","title":"LazyGrids.ndgrid","text":"(xg, yg, ...) = ndgrid(v1, v2, ...)\n\nConstruct ndgrid tuple for AbstractVector inputs. Each output has a lazy grid type (subtype of AbstractGrid) according to the corresponding input vector type.\n\nExamples\n\njulia> xg, yg = ndgrid(1:3, [:a, :b])\n([1 1; 2 2; 3 3], [:a :b; :a :b; :a :b])\n\njulia> xg\n3×2 LazyGrids.GridUR{Int64, 1, 2}:\n 1  1\n 2  2\n 3  3\n\njulia> yg\n3×2 LazyGrids.GridAV{Symbol, 2, 2}:\n :a  :b\n :a  :b\n :a  :b\n\n\n\n\n\n","category":"method"},{"location":"methods/#LazyGrids.ndgrid_array-Tuple{Vararg{AbstractVector}}","page":"Methods","title":"LazyGrids.ndgrid_array","text":"(xg, yg, ...) = ndgrid_array(v1, v2, ...)\n\nMethod to construct a tuple of (dense) Arrays from a set of vectors.\n\nThis tuple can use a lot of memory so should be avoided in general! It is provided mainly for testing and timing comparisons.\n\nEach input should be an AbstractVector of some type. The corresponding output Array will have the same element type.\n\nThis method provides similar functionality as Matlab's ndarray function but is more general because the vectors can be any type.\n\nExamples\n\njulia> ndgrid_array(1:3, 1:2)\n([1 1; 2 2; 3 3], [1 2; 1 2; 1 2])\n\njulia> ndgrid(1:3, [:a,:b])\n([1 1; 2 2; 3 3], [:a :b; :a :b; :a :b])\n\n\n\n\n\n","category":"method"},{"location":"methods/#LazyGrids.@timeo-Tuple{Any}","page":"Methods","title":"LazyGrids.@timeo","text":"@timeo\n\nA version of @time that shows the timing only, not the computed values. Returns a string so that Literate will capture the output.\n\n\n\n\n\n","category":"macro"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = LazyGrids","category":"page"},{"location":"#LazyGrids.jl-Documentation","page":"Home","title":"LazyGrids.jl Documentation","text":"","category":"section"},{"location":"#Overview","page":"Home","title":"Overview","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This Julia module exports a method ndgrid for generating lazy versions of grids from a collection of 1D vectors (any AbstractVector type).","category":"page"},{"location":"","page":"Home","title":"Home","text":"For a lazy version akin to meshgrid, simply add this line of code:","category":"page"},{"location":"","page":"Home","title":"Home","text":"meshgrid(y,x) = (ndgrid(x,y)[[2,1]]...,)","category":"page"},{"location":"","page":"Home","title":"Home","text":"See the Examples tab for details.","category":"page"}]
}
