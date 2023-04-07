// Issue mpv-player/mpv#5330
// Generate a temp screenshot file on desktop then copy to clipboard. (Windows only)
// nircmd is required: http://www.nirsoft.net/utils/nircmd.html
//
// script option: ss-2-cb-nircmdc="nircmdc"
//     Path to nircmdc executable file.
//     If not set, nircmdc will be searched in Windows PATH variable.
//
// Example: mpv file.mkv --script-opts=ss-2-cb-nircmdc="C:\nircmd\nircmdc.exe"


var nircmdc = "nircmdc";
function getOption()
{
    var opt = mp.get_opt("ss-2-cb-nircmdc");
    if (opt)
        nircmdc = opt;
}
getOption();

function ss_2_cb()
{
	var ss_file = mp.get_property("path").concat(".jpg");
	print(mp.last_error());
    mp.commandv("no-osd", "screenshot-to-file", ss_file);
	mp.commandv("no-osd", "async", "screenshot");
    mp.utils.subprocess_detached({"args" : [nircmdc, "clipboard", "copyimage",
        ss_file]});
}

function ss_2_cb_video()
{
    mp.commandv("osd-msg", "screenshot-to-file", ss_file, "video");
    mp.utils.subprocess_detached({"args" : [nircmdc, "clipboard", "copyimage",
        ss_file]});
}

function ss_2_cb_window()
{
    mp.commandv("osd-msg", "screenshot-to-file", ss_file, "window");
    mp.utils.subprocess_detached({"args" : [nircmdc, "clipboard", "copyimage",
        ss_file]});
}

mp.add_forced_key_binding("f1", "screenshot-to-clipboard", ss_2_cb);
//mp.add_key_binding("c", "screenshot-to-clipboard_video", ss_2_cb_video);
//mp.add_key_binding("c", "screenshot-to-clipboard_window", ss_2_cb_window);
