import React from 'react';

/**
 * 法律文书正文：《隐私政策》与《用户服务协议》
 * 内容与「印序色卡」纯本地运行、零数据采集的真实技术实现保持一致。
 * 开发者主体：光年跃迁（温州）科技有限公司
 */

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-sm font-bold text-white mt-7 mb-3 pb-2 border-b border-white/10 flex items-center gap-2">
    {children}
  </h2>
);

const Para: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`mb-3 text-neutral-300 leading-relaxed ${className}`}>{children}</p>
);

export const PrivacyPolicyContent: React.FC = () => (
  <div className="text-xs sm:text-[13px]">
    <h1 className="text-lg font-bold text-emerald-400 text-center mb-1">隐私政策</h1>
    <p className="text-center text-neutral-500 mb-5">
      <strong>生效日期</strong>：2026年9月8日
    </p>

    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
      <p className="text-neutral-300 leading-relaxed">
        欢迎使用「印序色卡」（以下简称“本应用”）。本应用由
        <strong className="text-white">光年跃迁（温州）科技有限公司</strong>
        （以下简称“我们”）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。
      </p>
    </div>

    <Para>
      本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中产生的信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。
    </Para>

    <SectionTitle>一、我们收集的信息</SectionTitle>
    <Para>本应用为纯本地运行的色彩工具，无需注册登录、不架设云端服务器。在您使用过程中：</Para>
    <ol className="list-decimal pl-5 space-y-2.5 text-neutral-300">
      <li>
        <strong className="text-white">本地色彩内容：</strong>
        您在应用中自主新建的自定义色卡、添加的色彩收藏、最近浏览足迹，均仅存放在您设备的本地存储（应用沙盒）内，用于为您提供色卡管理、收藏与历史记录功能，<strong className="text-white">不会上传至任何服务器</strong>。
      </li>
      <li>
        <strong className="text-white">我们不收集的信息：</strong>
        本应用不索取您的姓名、手机号码、电子邮箱等个人身份信息；不读取、不上传设备 IMEI、IMSI、MAC 地址、Android ID、IDFA 等设备硬件标识符，不采集精准地理位置，不记录 IP 地址用于追踪。
      </li>
      <li>
        <strong className="text-white">照片与图片：</strong>
        仅在您主动使用「图片取色」功能时读取您选取的特定照片，色彩聚类分析在您设备的前端引擎本地实时完成，<strong className="text-white">照片不会离开您的设备、绝不上传</strong>。
      </li>
      <li>
        <strong className="text-white">剪贴板：</strong>
        仅在您点击复制颜色代码（HEX / RGB / CMYK / HSB）时写入剪贴板，本应用不读取、不监控您剪贴板中的已有内容。
      </li>
    </ol>

    <SectionTitle>二、我们如何使用信息</SectionTitle>
    <Para>您的全部信息均在本地设备上用于实现色卡数值查询与换算、收藏管理、图片取色、智能配色生成、色卡海报导出与分享等核心功能：</Para>
    <ol className="list-decimal pl-5 space-y-2.5 text-neutral-300">
      <li>不用于商业营销、不构建用户画像、不进行跨应用追踪；</li>
      <li>不存在基于您的数据进行的云端数据分析或统计行为。</li>
    </ol>

    <SectionTitle>三、第三方 SDK 与信息共享</SectionTitle>
    <Para>我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：</Para>
    <ol className="list-decimal pl-5 space-y-2.5 text-neutral-300">
      <li>
        <strong className="text-white">系统能力组件：</strong>
        本应用基于 Capacitor 开源框架构建，使用其 Filesystem（文件写入）与 Share（系统分享）能力封装，仅在您主动保存色卡海报或调起系统分享面板时触发，用于将生成的图片写入设备缓存并交由操作系统分享，<strong className="text-white">不涉及任何个人信息的上传或汇集</strong>；分享目标由您自行选择。
      </li>
      <li>
        <strong className="text-white">无追踪类 SDK：</strong>
        本应用未接入任何广告分发 SDK、数据统计分析 SDK、用户行为追踪组件或推送 SDK。
      </li>
      <li>
        <strong className="text-white">法定情形：</strong>
        根据法律法规规定或行政、司法机关的强制性要求，我们可能配合披露相关信息。
      </li>
      <li>
        <strong className="text-white">获得明确同意：</strong>
        在获得您明确同意后，我们才会向第三方共享您的信息。
      </li>
    </ol>

    <SectionTitle>四、信息的存储与保护</SectionTitle>
    <ol className="list-decimal pl-5 space-y-2.5 text-neutral-300">
      <li>
        <strong className="text-white">存储地点与期限：</strong>
        您的色彩数据仅存储于您本人设备的本地沙盒中，不存在云端留存。数据将保留至您在应用内删除、清除应用数据或卸载应用为止。
      </li>
      <li>
        <strong className="text-white">安全措施：</strong>
        数据不经过网络传输，从根本上规避了传输泄露风险；应用仅在必要时申请照片与存储权限，且均由您主动触发。
      </li>
    </ol>

    <SectionTitle>五、您的权利</SectionTitle>
    <ol className="list-decimal pl-5 space-y-2.5 text-neutral-300">
      <li><strong className="text-white">访问与管理：</strong>您可随时在应用内查看、搜索全部色卡及您的收藏与足迹。</li>
      <li><strong className="text-white">更正权：</strong>您可对自建色卡进行编辑或重新创建。</li>
      <li><strong className="text-white">删除权：</strong>您可随时删除单条自定义色卡（收藏同步移除），或通过系统设置“清除应用数据”、卸载应用彻底清除全部本地数据。</li>
      <li><strong className="text-white">导出权：</strong>您可通过海报导出与系统分享功能，自行保存或分享您创作的色彩内容。</li>
    </ol>

    <SectionTitle>六、未成年人保护</SectionTitle>
    <Para>
      我们非常重视对未成年人个人信息的保护。如您是未满 14 周岁的未成年人，应在监护人指导下阅读本政策并征得监护人同意后使用本应用。本应用不主动收集任何个人身份信息，如监护人发现相关数据留存，可通过卸载应用立即彻底删除。
    </Para>

    <SectionTitle>七、本政策的更新</SectionTitle>
    <Para>
      我们可能根据法律法规更新或功能调整适时修订本政策。修订后的政策将在应用内显著位置公示；更新后您首次启动应用时将再次征求您的同意，若您不同意修订后的政策，可停止使用并卸载本应用。
    </Para>

    <SectionTitle>八、联系我们</SectionTitle>
    <Para>如您对本隐私政策有任何疑问、意见或建议，或需要行使相关权利，请通过以下方式与我们联系：</Para>
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5">
      <p className="text-neutral-300">
        <strong className="text-white">电子邮箱</strong>：Jp112022@163.com
      </p>
    </div>

    <div className="mt-7 pt-5 border-t border-white/10 text-center space-y-1.5">
      <p className="text-neutral-400">感谢您使用印序色卡！</p>
      <p className="text-neutral-500 text-[11px]">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

export const UserAgreementContent: React.FC = () => (
  <div className="text-xs sm:text-[13px]">
    <h1 className="text-lg font-bold text-emerald-400 text-center mb-1">用户服务协议</h1>
    <p className="text-center text-neutral-500 mb-5">更新日期：2026年9月8日</p>

    <SectionTitle>1. 协议的接受</SectionTitle>
    <Para>欢迎使用「印序色卡」应用（以下简称「本应用」）。</Para>
    <Para>
      本协议是您与<strong className="text-white">光年跃迁（温州）科技有限公司</strong>（以下简称「我们」）之间关于使用本应用的法律协议。
    </Para>
    <Para>通过下载、安装或使用本应用，即表示您已阅读、理解并同意接受本协议的全部条款；如您不同意，请勿使用本应用。</Para>

    <SectionTitle>2. 服务内容</SectionTitle>
    <Para>本应用为色彩美学工具，提供以下服务：</Para>
    <ul className="list-disc pl-5 space-y-2 text-neutral-300">
      <li>内置色卡的 HEX / RGB / CMYK / HSB 色彩数值查询与快捷复制；</li>
      <li>色卡收藏、自定义色卡创建与浏览足迹管理；</li>
      <li>相册图片本地取色（端侧色彩聚类提取）；</li>
      <li>智能配色方案生成（互补、同类、三元、阶进等）；</li>
      <li>单卡与多卡色卡海报的生成、导出与系统分享。</li>
    </ul>

    <SectionTitle>3. 用户义务</SectionTitle>
    <Para>作为本应用的用户，您同意：</Para>
    <ul className="list-disc pl-5 space-y-2 text-neutral-300">
      <li>遵守本协议的所有条款及相关法律法规；</li>
      <li>不使用本应用从事任何违法违规活动；</li>
      <li>不干扰本应用的正常运行，不进行逆向、破解或恶意攻击；</li>
      <li>妥善保管您的设备，对设备上的本地数据自行负责。</li>
    </ul>

    <SectionTitle>4. 知识产权</SectionTitle>
    <Para>
      本应用的软件著作权及界面设计、代码、图标等内容归我们所有，受知识产权法律法规保护。未经书面许可，您不得复制、修改、分发或用于商业用途。
    </Para>
    <Para>
      应用内收录的流行色名称及品牌历史典故仅作文化鉴赏与设计审美参考，相关商标权益归原权利人所有。
    </Para>

    <SectionTitle>5. 免责声明</SectionTitle>
    <Para>本应用按「原样」提供，不做任何形式的明示或默示保证：</Para>
    <ul className="list-disc pl-5 space-y-2 text-neutral-300">
      <li>屏幕显示色彩受设备、材质与工艺影响，与实际印刷、涂料、织物等成品可能存在色差，正式生产请以标准色票打样为准；</li>
      <li>我们不保证本应用将无中断、无错误地运行，亦不保证功能结果完全满足您的预期；</li>
      <li>您的色卡数据仅存储于本地设备，因卸载应用、清除数据、设备损坏或丢失导致的数据灭失，请您自行通过导出海报等方式备份，我们不承担云端恢复责任。</li>
    </ul>

    <SectionTitle>6. 协议的终止</SectionTitle>
    <Para>
      您可随时停止使用本应用；卸载本应用即终止本协议，同时设备本地存储的全部色彩数据将被彻底清除。如您违反本协议，我们有权随时终止您使用本应用的权利。
    </Para>

    <SectionTitle>7. 适用法律</SectionTitle>
    <Para>本协议受中华人民共和国法律管辖。</Para>
    <Para>
      任何与本协议相关的争议，应通过友好协商解决；协商不成的，应提交至温州市有管辖权的人民法院诉讼解决。
    </Para>

    <div className="mt-7 pt-5 border-t border-white/10 text-center">
      <p className="text-neutral-500 text-[11px]">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);
