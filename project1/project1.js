// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    // console.log('fgpos.' + fgPos.x);
    // console.log('fgpos.' + fgPos.y);
    // bgImg = fgImg * fgOpac + (1 - fgOpac) * bgImg; //;
    // bgImg = fgImg * fgPos.x * fgOpac + (1 - fgOpac) * bgImg * fgPos.y;

    // var pixels = bgImg.with * bgImg.height;
    // console.log(pixels);
    // console.log(fgOpac);

    var datasize = bgImg.data.length;
    console.log(fgImg.data[3004]);

    for (var i = 3; i < datasize; i+=4) 
    {
        // var alpha = fgImg.data[i] + (1 - fgImg.data[i]) * bgImg.data[i];
        bgImg.data[i-3] = fgImg.data[i-3] * fgImg.data[i] * fgOpac * 1 / 255 + (1 - fgImg.data[i] * fgOpac * 1 / 255) * bgImg.data[i-3];
        bgImg.data[i-2] = fgImg.data[i-2] * fgImg.data[i] * fgOpac * 1 / 255 + (1 - fgImg.data[i] * fgOpac * 1 / 255) * bgImg.data[i-2];
        bgImg.data[i-1] = fgImg.data[i-1] * fgImg.data[i] * fgOpac * 1 / 255 + (1 - fgImg.data[i] * fgOpac * 1 / 255) * bgImg.data[i-1];
        // fgImg.data[i] = fgOpac;
        // bgImg.data[i] = fgImg.data[i] * fgOpac + (1 - fgOpac) * bgImg.data[i];
    }

    console.log(datasize);
    console.log(bgImg.data[12])
}
