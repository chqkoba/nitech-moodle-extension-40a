import type { Feature } from '../common/types.ts';
import { getCourses } from '../../common/storage/course.ts';

type ReplaceNavigationText = {
  enabled: boolean;
};

/** ナビゲーションのコース表示名をわかりやすい表示に変更する */
const replaceNavigationText: Feature<ReplaceNavigationText> = {
  uniqueName: 'all-pages-replace-navigation-texts',
  hostnameFilter: 'cms7.ict.nitech.ac.jp',
  pathnameFilter: /^\/moodle40a\//,
  defaultOption: {
    enabled: true,
  },
  loader: async (options) => {
    if (!options.enabled) {
      return;
    }

    const elNavigation = document.querySelector('section.block_navigation');
    if (!elNavigation) {
      return;
    }

    const courses = await getCourses();
    const courseNameMap = new Map<string, string>();
    for (const course of courses) {
      courseNameMap.set(course.shortName, course.name);
    }

    const elMyCourse = document.evaluate(
      `.//a[contains(text(), "マイコース")]/../../ul`,
      elNavigation,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null,
    ).iterateNext() as HTMLElement | null;
    if (!elMyCourse) {
      return;
    }

    const elMyCourseItems = elMyCourse.querySelectorAll('li a');
    elMyCourseItems.forEach((elItem) => {
      const shortName = elItem.textContent?.trim() ?? '';
      const courseName = courseNameMap.get(shortName);

      if (typeof courseName === 'string') {
        elItem.textContent = courseName;
      }
    });
  },
};

export default replaceNavigationText;
