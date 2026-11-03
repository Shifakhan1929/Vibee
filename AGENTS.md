<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Website import
- Keep imported markup and interactive JSX in its route file and retain captured CSS separately to preserve source structure and cascade.
- Use importedDocument route staticData for source html/body attributes so the shared root owns the document shell.
- Keep category-to-filter mappings in a browser-safe shared module and use the existing city route's search parameters; this avoids duplicated city pages and makes card navigation testable.
- Keep responsive import overrides in a separate stylesheet loaded after captured CSS, scoped to the affected sections; this preserves imported artwork and cascade.
