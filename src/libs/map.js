/**
 * 存放一些静态变量、Map 等全局可用的变量
 * @author 李雅婷
 */
/**
 * 未知文件类型图标
 */
export const unknownImg = require('@/assets/images/file/file_unknow.png')

/**
 * 文件类型图标 Map 映射
 */
export const fileImgMap = new Map([
  ['avi', require('@/assets/images/file/file_avi.png')],
  ['chm', require('@/assets/images/file/file_chm.png')],
  ['css', require('@/assets/images/file/file_css.png')],
  ['csv', require('@/assets/images/file/file_csv.png')],
  ['dmg', require('@/assets/images/file/file_dmg.png')],
  ['dir', require('@/assets/files/folder.png')],
  ['doc', require('@/assets/images/file/file_word.png')],
  ['docx', require('@/assets/images/file/file_word.png')],
  ['exe', require('@/assets/images/file/file_exe.png')],
  ['html', require('@/assets/images/file/file_html.png')],
  ['jar', require('@/assets/images/file/file_jar.png')],
  ['java', require('@/assets/images/file/file_java.png')],
  ['js', require('@/assets/images/file/file_js.png')],
  ['json', require('@/assets/images/file/file_json.png')],
  ['mp3', require('@/assets/images/file/file_music.png')],
  ['oa', require('@/assets/images/file/file_oa.png')],
  ['open', require('@/assets/images/file/file_open.png')],
  ['pdf', require('@/assets/images/file/file_pdf.png')],
  ['ppt', require('@/assets/images/file/file_ppt.png')],
  ['pptx', require('@/assets/images/file/file_ppt.png')],
  ['rar', require('@/assets/images/file/file_rar.png')],
  ['rtf', require('@/assets/images/file/file_rtf.png')],
  ['sql', require('@/assets/images/file/file_sql.png')],
  ['svg', require('@/assets/images/file/file_svg.png')],
  ['txt', require('@/assets/images/file/file_txt.png')],
  ['vue', require('@/assets/images/file/file_vue.png')],
  ['xls', require('@/assets/images/file/file_excel.png')],
  ['xlsx', require('@/assets/images/file/file_excel.png')],
  ['zip', require('@/assets/images/file/file_zip.png')],
  ['mp4', require('@/assets/files/type_video.png')]
])

export const fileTypeImgMap = new Map([
  ['1', require('@/assets/files/type_image.png')],
  ['2', require('@/assets/files/type_image.png')],
  ['3', require('@/assets/files/type_video.png')],
  ['4', require('@/assets/files/type_zip.png')],
  ['5', require('@/assets/files/type_audio.png')],
  ['6', require('@/assets/files/type_image.png')]
])
export const userAvatar = require('@/assets/avatar.jpg')
/**
 * 可以用代码编辑器打开的文件后缀和 解析语言、 codemirror 解析模式 mode 映射关系
 * language：解析语言,
 * mime: codemirror 解析模式
 */
export const fileSuffixCodeModeMap = new Map([
  [
    'c',
    {
      language: 'C',
      mime: 'text/x-csrc'
    }
  ],
  [
    'c++',
    {
      language: 'C++',
      mime: 'text/x-c++src'
    }
  ],
  [
    'c#',
    {
      language: 'C#',
      mime: 'text/x-csharp'
    }
  ],
  [
    'm',
    {
      language: 'Objective-C',
      mime: 'text/x-objectivec'
    }
  ],
  [
    'go',
    {
      language: 'GO',
      mime: 'text/x-go'
    }
  ],
  [
    'kt',
    {
      language: 'Kotlin',
      mime: 'text/x-java'
    }
  ],
  [
    'css',
    {
      language: 'CSS',
      mime: 'text/css'
    }
  ],
  [
    'less',
    {
      language: 'Less',
      mime: 'text/x-less'
    }
  ],
  [
    'php',
    {
      language: 'PHP',
      mime: 'text/x-php'
    }
  ],
  [
    'bat',
    {
      language: 'PowerShell',
      mime: 'application/x-powershell'
    }
  ],
  [
    'py',
    {
      language: 'Python',
      mime: 'text/x-python'
    }
  ],
  [
    'properties',
    {
      language: 'Properties',
      mime: 'text/x-properties'
    }
  ],
  [
    'R',
    {
      language: 'R',
      mime: 'text/x-rsrc'
    }
  ],
  [
    'rs',
    {
      language: 'Rust',
      mime: 'text/x-rustsrc'
    }
  ],
  [
    'scss',
    {
      language: 'Scss',
      mime: 'text/x-scss'
    }
  ],
  [
    'sass',
    {
      language: 'Sass',
      mime: 'text/x-sass'
    }
  ],
  [
    'sh',
    {
      language: 'Shell',
      mime: 'text/x-sh'
    }
  ],
  [
    'styl',
    {
      language: 'stylus',
      mime: 'text/x-styl'
    }
  ],
  [
    'xml',
    {
      language: 'XML',
      mime: 'text/xml'
    }
  ],
  [
    'html',
    {
      language: 'HTML',
      mime: 'text/html'
    }
  ],
  [
    'http',
    {
      language: 'HTTP',
      mime: 'text/http'
    }
  ],
  [
    'conf',
    {
      language: 'Nginx',
      mime: 'text/x-nginx-conf'
    }
  ],
  [
    'java',
    {
      language: 'Java',
      mime: 'text/x-java'
    }
  ],
  [
    'js',
    {
      language: 'JavaScript',
      mime: 'text/javascript'
    }
  ],
  [
    'ts',
    {
      language: 'Typescript',
      mime: 'text/typescript'
    }
  ],
  [
    'json',
    {
      language: 'JSON',
      mime: 'application/json'
    }
  ],
  [
    'jsp',
    {
      language: 'JSP',
      mime: 'application/x-jsp'
    }
  ],
  [
    'txt',
    {
      language: '',
      mime: ''
    }
  ],
  [
    'vue',
    {
      language: 'HTML',
      mime: 'text/html'
    }
  ],
  [
    'sql',
    {
      language: 'SQL',
      mime: 'text/x-sql'
    }
  ],
  [
    'swift',
    {
      language: 'Swift',
      mime: 'text/x-swift'
    }
  ],
  [
    'yml',
    {
      language: 'YAML',
      mime: 'text/x-yaml'
    }
  ]
])
/**
 * 支持使用 onlyoffice 打开的文件格式
 */
export const officeFileType = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx']

/**
 * 文件展示模式选择列表时,所有可供选择的表格列名
 */
export const allColumnList = [
  'extendName',
  'fileSize',
  'uploadTime',
  'deleteTime'
]

/**
 * codemirror 编辑器代码高亮主题列表
 */
export const codeMirrorThemeList = [
  '3024-day',
  '3024-night',
  'abbott',
  'abcdef',
  'ambiance-mobile',
  'ambiance',
  'ayu-dark',
  'ayu-mirage',
  'base16-dark',
  'base16-light',
  'bespin',
  'blackboard',
  'cobalt',
  'colorforth',
  'darcula',
  'dracula',
  'duotone-dark',
  'duotone-light',
  'eclipse',
  'elegant',
  'erlang-dark',
  'gruvbox-dark',
  'hopscotch',
  'icecoder',
  'idea',
  'isotope',
  'juejin',
  'lesser-dark',
  'liquibyte',
  'lucario',
  'material-darker',
  'material-ocean',
  'material-palenight',
  'material',
  'mbo',
  'mdn-like',
  'midnight',
  'monokai',
  'moxer',
  'neat',
  'neo',
  'night',
  'nord',
  'oceanic-next',
  'panda-syntax',
  'paraiso-dark',
  'paraiso-light',
  'pastel-on-dark',
  'railscasts',
  'rubyblue',
  'seti',
  'shadowfox',
  'solarized',
  'ssms',
  'the-matrix',
  'tomorrow-night',
  'tomorrow-night-bright',
  'tomorrow-night-eighties',
  'ttcn',
  'twilight',
  'vibrant-ink',
  'xq-dark',
  'xq-light',
  'yeti',
  'yonce',
  'zenburn'
]
/**
 * codemirror 编辑器代码字体大小
 */
export const fontSizeList = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30]

export const videoHotkey = [
  {
    key: '0 到 9',
    value: '分别跳转 0 到 90%'
  },
  {
    key: 'space',
    value: '播放/暂停'
  },
  {
    key: 'M',
    value: '切换静音'
  },
  {
    key: 'F',
    value: '切换全屏'
  },
  {
    key: '→',
    value: '单次快进10s'
  },
  {
    key: '←',
    value: '快退10s'
  },
  {
    key: '↑',
    value: '音量增加10%'
  },
  {
    key: '↓',
    value: '音量降低10%'
  },
  {
    key: 'Esc',
    value: '退出全屏'
  }
]
export const defaultMenuList = [
  {
    id: 1,
    name: '打开',
    iconClassName: 'icon-openl',
    methodName: 'menuOpen',
    count: 1
  },
  // {
  //   id: 2,
  //   name: '下载',
  //   iconClassName: 'icon-xiazai',
  //   methodName: 'menuDownload'
  // },
  {
    id: 3,
    name: '分享',
    iconClassName: 'icon-fenxiang1',
    methodName: 'menuShare'
  },
  {
    id: 4,
    name: '复制',
    iconClassName: 'icon-fuzhi',
    methodName: 'menuCopy'
  },
  {
    id: 5,
    name: '移动',
    iconClassName: 'icon-yidong',
    methodName: 'menuMove'
  },
  {
    id: 6,
    name: '重命名',
    iconClassName: 'icon-zhongmingming',
    methodName: 'menuRename'
  },
  {
    id: 7,
    name: '删除',
    iconClassName: 'icon-shanchu',
    methodName: 'menuDelete'
  }
]
export const multiMenuList = [
  {
    id: 2,
    name: '下载',
    iconClassName: 'icon-xiazai',
    methodName: 'menuDownload'
  },
  {
    id: 3,
    name: '分享',
    iconClassName: 'icon-fenxiang1',
    methodName: 'menuShare'
  },
  {
    id: 4,
    name: '复制',
    iconClassName: 'icon-fuzhi',
    methodName: 'menuCopy'
  },
  {
    id: 5,
    name: '移动',
    iconClassName: 'icon-yidong',
    methodName: 'menuMove'
  },
  // {
  //   id: 6,
  //   name: '重命名',
  //   iconClassName: 'icon-zhongmingming',
  //   methodName: 'menuRename'
  // },
  {
    id: 7,
    name: '删除',
    iconClassName: 'icon-shanchu',
    methodName: 'menuDelete'
  }
]
export const blankMenuList = [
  {
    id: 1,
    name: '刷新',
    iconClassName: 'icon-shuaxin',
    methodName: 'menuRefresh',
    count: 1
  },
  {
    id: 2,
    name: '新建文件夹',
    iconClassName: 'icon-xinjianwenjianjia',
    methodName: 'menuCreateFolder'
  }
]
export const RecycleMenuList = [
  {
    id: 1,
    name: '还原',
    iconClassName: 'icon-huanyuanhuanyuanxuanzhongxiang',
    methodName: 'restoreFile',
    count: 1
  },
  {
    id: 2,
    name: '删除',
    iconClassName: 'icon-shanchu',
    methodName: 'deleteRecycle'
  }
]
export const shareMenuList = [
  {
    id: 1,
    name: '取消分享',
    iconClassName: '',
    methodName: 'menuCancelShare'
  }
]
export const conversionExtList = ['doc', 'docx', 'pdf', 'xls', 'xlsx']
