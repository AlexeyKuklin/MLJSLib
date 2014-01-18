'use strict';

function Ziggurat(seed) {
    this.jsr = 123456789;
    this.wn = [];   //128
    this.fn = [];
    this.kn = [];

    // seed generator based on current time
    if (typeof seed != 'undefined') {
        this.jsr ^= seed;
    } else {
        this.jsr ^= new Date().getTime();
    }

    this.zigset();
}

Ziggurat.prototype = {

    nextGaussian: function(){
        return this.RNOR();
    },

    RNOR: function() {
        var hz = this.SHR3();
        var iz = hz & 127;
        return (Math.abs(hz) < this.kn[iz]) ? hz * this.wn[iz] : this.nfix(hz, iz);
    },

    nfix: function (hz, iz) {
        var r = 3.442619855899;
        var r1 = 1.0 / r;
        var x;
        var y;
        while(true){
            x = hz * this.wn[iz];
            if( iz == 0 ){
                x = (-Math.log(this.UNI()) * r1);
                y = -Math.log(this.UNI());
                while( y + y < x * x){
                    x = (-Math.log(this.UNI()) * r1);
                    y = -Math.log(this.UNI());
                }
                return ( hz > 0 ) ? r+x : -r-x;
            }

            if( this.fn[iz] + this.UNI() * (this.fn[iz-1] - this.fn[iz]) < Math.exp(-0.5 * x * x) ){
                return x;
            }
            hz = this.SHR3();
            iz = hz & 127;

            if( Math.abs(hz) < this.kn[iz]){
                return (hz * this.wn[iz]);
            }
        }
    },

    SHR3: function() {
        var jz = this.jsr;
        var jzr = this.jsr;
        jzr ^= (jzr << 13);
        jzr ^= (jzr >>> 17);
        jzr ^= (jzr << 5);
        this.jsr = jzr;
        return (jz+jzr) | 0;
    },

    UNI: function(){
        return 0.5 * (1 + this.SHR3() / -Math.pow(2,31));
    },

    zigset: function(){

        var m1 = 2147483648.0;
        var dn = 3.442619855899;
        var tn = dn;
        var vn = 9.91256303526217e-3;

        var q = vn / Math.exp(-0.5 * dn * dn);
        this.kn[0] = Math.floor((dn/q)*m1);
        this.kn[1] = 0;

        this.wn[0] = q / m1;
        this.wn[127] = dn / m1;

        this.fn[0] = 1.0;
        this.fn[127] = Math.exp(-0.5 * dn * dn);

        for(var i = 126; i >= 1; i--) {
            dn = Math.sqrt(-2.0 * Math.log( vn / dn + Math.exp( -0.5 * dn * dn)));
            this.kn[i+1] = Math.floor((dn/tn)*m1);
            tn = dn;
            this.fn[i] = Math.exp(-0.5 * dn * dn);
            this.wn[i] = dn / m1;
        }
    }

};

exports.Ziggurat = Ziggurat;


//https://gist.github.com/banksean/300494
/*
 A C-program for MT19937, with initialization improved 2002/1/26.
 Coded by Takuji Nishimura and Makoto Matsumoto.

 Before using, initialize the state by using init_genrand(seed)
 or init_by_array(init_key, key_length).

 Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
 All rights reserved.
 */

var MersenneTwister = function(seed) {
    if (seed == undefined) {
        seed = new Date().getTime();
    }
    /* Period parameters */
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df;   /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

    this.init_genrand(seed);
};


MersenneTwister.prototype = {
    /* initializes mt[N] with a seed */
    init_genrand : function(s) {
        this.mt[0] = s >>> 0;
        for (this.mti=1; this.mti<this.N; this.mti++) {
            s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    },

    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    init_by_array: function(init_key, key_length) {
        var i, j, k;
        this.init_genrand(19650218);
        i=1; j=0;
        k = (this.N>key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
                + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++; j++;
            if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
            if (j>=key_length) j=0;
        }
        for (k=this.N-1; k; k--) {
            s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
                - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    },

    /* generates a random number on [0,0xffffffff]-interval */
    genrand_int32: function() {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

            if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */

            for (kk=0;kk<this.N-this.M;kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (;kk<this.N-1;kk++) {
                y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
                this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
            this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    },

    /* generates a random number on [0,0x7fffffff]-interval */
    genrand_int31: function() {
        return (this.genrand_int32()>>>1);
    },

    /* generates a random number on [0,1]-real-interval */
    genrand_real1 : function() {
        return this.genrand_int32()*(1.0/4294967295.0);
        /* divided by 2^32-1 */
    },

    /* generates a random number on [0,1)-real-interval */
    random: function() {
        return this.genrand_int32()*(1.0/4294967296.0);
        /* divided by 2^32 */
    },

    /* generates a random number on (0,1)-real-interval */
    genrand_real3: function() {
        return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
        /* divided by 2^32 */
    },

    /* generates a random number on [0,1) with 53-bit resolution*/
    genrand_res53:function() {
        var a = this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
        return(a*67108864.0+b)*(1.0/9007199254740992.0);
    }

};

exports.MersenneTwister = MersenneTwister;








