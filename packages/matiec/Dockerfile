# Use the emscripten/emsdk Docker image as base
FROM emscripten/emsdk as build-env

# matiec base toolchain
RUN apt-get update && apt-get install -y autoconf automake bison flex libtool cmake make

# Clone the matiec repo
RUN git clone https://github.com/beremiz/matiec

WORKDIR matiec

RUN autoreconf -i

# Set CMake to use Emscripten's toolchain file. This tells CMake to generate Makefiles
# that use Emscripten's version of GCC, etc.
ENV CMAKE_TOOLCHAIN_FILE=${EMSDK}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake

RUN emconfigure ./configure

# We need both the main function and FS to be exported so we can load all files necessary for matiec before main is called. 
RUN emmake make CXXFLAGS="-s MODULARIZE -s EXPORT_ES6 -s SINGLE_FILE -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\", \"FS\"]'"