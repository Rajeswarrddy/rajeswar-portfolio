# Rajeswar Reddy Pondugula — Portfolio

Static portfolio site (HTML, CSS and a little JavaScript). No build step. Ready for GitHub Pages.

```
index.html                                     the page
404.html                                       not-found page
.nojekyll                                      tells GitHub Pages to serve files as-is
assets/css/style.css                           styles
assets/js/main.js                              navigation + the "Pipeline lab" simulation
assets/images/profile.jpg                      profile photo
assets/images/favicon.svg                      browser tab icon
assets/resume/Rajeswar_Pondugula_Resume.pdf    résumé used by every "Résumé" button
```

The résumé PDF in this repo already carries the portfolio address (`rajeswarrddy.github.io`) in its header.

## Deploy on GitHub Pages (about 5 minutes)

1. Sign in to GitHub as **Rajeswarrddy** and create a new **public** repository named exactly **`Rajeswarrddy.github.io`**.
2. Upload everything in this folder to the repository root, including the `assets` folder and the hidden `.nojekyll` file.
   - Web upload: **Add file → Upload files**, drag the contents in, then **Commit changes**.
   - Or with Git:
     ```bash
     git clone https://github.com/Rajeswarrddy/Rajeswarrddy.github.io.git
     cd Rajeswarrddy.github.io
     # copy this folder's contents here, then:
     git add -A
     git commit -m "Add portfolio"
     git push origin main
     ```
3. In the repository go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After one or two minutes the site is live at **https://rajeswarrddy.github.io/**.
5. Add that link to the GitHub profile (**Edit profile → Website**) and to LinkedIn.

If the repository has a different name, the site is served from `https://rajeswarrddy.github.io/<repo-name>/` and the address printed in the résumé would no longer be correct. `404.html` also uses root-relative paths. Keep the name `Rajeswarrddy.github.io` unless there is a reason to change it.

## Replace the photo

Save a square photo (at least 600 × 600 px, JPG) over `assets/images/profile.jpg` and commit it.

## Update the résumé

Replace `assets/resume/Rajeswar_Pondugula_Resume.pdf` with the new file using the same name. Keep the portfolio address in its header.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

- The phone number is not shown on the website, but it is printed on the résumé PDF that visitors can download.
