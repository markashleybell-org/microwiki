import { TagInput, ITag } from 'mab-bootstrap-taginput';

import 'mab-bootstrap-taginput/css/standard.css';

declare var _ALL_TAGS_MERGE: ITag[];

const tagMergeInputElements = document.getElementsByClassName('tag-input-merge');

for (var i = 0; i < tagMergeInputElements.length; i++) {
    new TagInput<ITag>({
        input: (tagMergeInputElements[i] as HTMLElement),
        data: _ALL_TAGS_MERGE || [],
        getId: item => item.id,
        getLabel: item => item.label,
        allowNewTags: false
    });
}
