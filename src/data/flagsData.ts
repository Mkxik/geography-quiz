// Flags of the World dataset.
// 197 JetPunk countries (193 UN members + Vatican City, Palestine, Kosovo, Taiwan)
// plus 8 extra territories / home nations = 205 entries.
// Flag images: flagcdn.com (free, ISO 3166-1 alpha-2 codes; gb-eng / gb-sct / gb-wls for UK nations).

export type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'

export const CONTINENTS: Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
]

export type FlagColor = 'red' | 'white' | 'blue' | 'yellow' | 'green' | 'black' | 'orange'

export const FLAG_COLORS: FlagColor[] = ['red', 'white', 'blue', 'yellow', 'green', 'black', 'orange']

export type FlagFeature =
  | 'star'
  | 'crescent'
  | 'cross'
  | 'sun'
  | 'circle'
  | 'triangle'
  | 'diagonal'
  | 'emblem'
  | 'animal'
  | 'map'

export const FLAG_FEATURES: FlagFeature[] = [
  'star',
  'crescent',
  'cross',
  'sun',
  'circle',
  'triangle',
  'diagonal',
  'emblem',
  'animal',
  'map',
]

export type SimilarityGroup =
  | 'Nordic Cross'
  | 'Pan-Arab Horizontal'
  | 'Pan-Arab Triangle'
  | 'Pan-African Vertical'
  | 'Pan-African Horizontal'
  | 'Pan-Slavic'
  | 'Tricolor-Vertical Green-White'
  | 'Tricolor-Vertical Blue-Yellow-Red'
  | 'Red-White-Blue Tricolor'
  | 'Tricolor-Horizontal Red-White-Green'
  | 'Tricolor-Horizontal'
  | 'Saffron-White-Green'
  | 'Black-Red-Gold'
  | 'Black-Red-Green Horizontal'
  | 'Red-White Bicolor'
  | 'Blue-Red Bicolor'
  | 'Vertical Bicolor'
  | 'Red-White-Red'
  | 'Gran Colombia'
  | 'Blue-White Stripes'
  | 'Five Stripes'
  | 'Striped with Canton'
  | 'Red with Blue Canton'
  | 'Union Jack Ensign'
  | 'Red & White Cross'
  | 'Saltire'
  | 'Double-Headed Eagle'
  | 'Dragon'
  | 'Crescent & Star'
  | 'Central Asian Crescent'
  | 'Red Field Emblem'
  | 'Disc'
  | 'Sun'
  | 'Blue with Stars'
  | 'Serrated'
  | 'Hoist Triangle'
  | 'Hoist Chevron'
  | 'Diagonal Band'
  | 'Caribbean Vertical'
  | 'None'

export interface Country {
  /** ISO 3166-1 alpha-2 code (lowercase), or flagcdn subdivision code (gb-eng, gb-sct, gb-wls). */
  id: string
  name: string
  aliases: string[]
  continent: Continent
  flagUrl: string
  similarityGroup: SimilarityGroup
  colors: FlagColor[]
  features: FlagFeature[]
  /** true for the 8 entities outside the 197-country list (territories, UK home nations). */
  isTerritory: boolean
}

type ContinentCode = 'AF' | 'AS' | 'EU' | 'NA' | 'SA' | 'OC'

const CONTINENT_BY_CODE: Record<ContinentCode, Continent> = {
  AF: 'Africa',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  SA: 'South America',
  OC: 'Oceania',
}

const COLOR_BY_LETTER: Record<string, FlagColor> = {
  r: 'red',
  w: 'white',
  b: 'blue',
  y: 'yellow',
  g: 'green',
  k: 'black',
  o: 'orange',
}

/**
 * Compact row: [id, name, continent, similarityGroup, colors, features, aliases?]
 * colors: letters r=red w=white b=blue y=yellow(gold) g=green k=black o=orange
 * features: space-separated FlagFeature names
 */
type Row = [string, string, ContinentCode, SimilarityGroup, string, string, string[]?]

const COUNTRY_ROWS: Row[] = [
  ['af', 'Afghanistan', 'AS', 'None', 'krgw', 'emblem'],
  ['al', 'Albania', 'EU', 'Double-Headed Eagle', 'rk', 'animal emblem'],
  ['dz', 'Algeria', 'AF', 'Crescent & Star', 'gwr', 'crescent star'],
  ['ad', 'Andorra', 'EU', 'Tricolor-Vertical Blue-Yellow-Red', 'byr', 'emblem'],
  ['ao', 'Angola', 'AF', 'None', 'rky', 'star emblem'],
  ['ag', 'Antigua and Barbuda', 'NA', 'Sun', 'rkbwy', 'sun triangle', ['Antigua']],
  ['ar', 'Argentina', 'SA', 'Blue-White Stripes', 'bwy', 'sun'],
  ['am', 'Armenia', 'AS', 'Tricolor-Horizontal', 'rbo', ''],
  ['au', 'Australia', 'OC', 'Union Jack Ensign', 'bwr', 'star cross'],
  ['at', 'Austria', 'EU', 'Red-White-Red', 'rw', ''],
  ['az', 'Azerbaijan', 'AS', 'Central Asian Crescent', 'brgw', 'crescent star'],
  ['bs', 'Bahamas', 'NA', 'Hoist Triangle', 'byk', 'triangle', ['The Bahamas']],
  ['bh', 'Bahrain', 'AS', 'Serrated', 'rw', ''],
  ['bd', 'Bangladesh', 'AS', 'Disc', 'gr', 'circle'],
  ['bb', 'Barbados', 'NA', 'Caribbean Vertical', 'byk', 'emblem'],
  ['by', 'Belarus', 'EU', 'None', 'rgw', 'emblem', ['Byelorussia']],
  ['be', 'Belgium', 'EU', 'Black-Red-Gold', 'kyr', ''],
  ['bz', 'Belize', 'NA', 'None', 'brwg', 'emblem'],
  ['bj', 'Benin', 'AF', 'Pan-African Vertical', 'gyr', '', ['Dahomey']],
  ['bt', 'Bhutan', 'AS', 'Dragon', 'yow', 'animal diagonal'],
  ['bo', 'Bolivia', 'SA', 'Pan-African Horizontal', 'ryg', 'emblem'],
  ['ba', 'Bosnia and Herzegovina', 'EU', 'Blue with Stars', 'byw', 'star triangle', ['Bosnia', 'BiH', 'Bosnia-Herzegovina']],
  ['bw', 'Botswana', 'AF', 'None', 'bkw', ''],
  ['br', 'Brazil', 'SA', 'None', 'gybw', 'star circle', ['Brasil']],
  ['bn', 'Brunei', 'AS', 'Diagonal Band', 'ywkr', 'crescent emblem diagonal', ['Brunei Darussalam']],
  ['bg', 'Bulgaria', 'EU', 'Tricolor-Horizontal Red-White-Green', 'wgr', ''],
  ['bf', 'Burkina Faso', 'AF', 'Pan-African Horizontal', 'rgy', 'star', ['Burkina', 'Upper Volta']],
  ['bi', 'Burundi', 'AF', 'Saltire', 'rgw', 'star cross diagonal'],
  ['cv', 'Cabo Verde', 'AF', 'Blue with Stars', 'bwry', 'star', ['Cape Verde']],
  ['kh', 'Cambodia', 'AS', 'None', 'brw', 'emblem', ['Kampuchea']],
  ['cm', 'Cameroon', 'AF', 'Pan-African Vertical', 'gry', 'star'],
  ['ca', 'Canada', 'NA', 'Red-White-Red', 'rw', ''],
  ['cf', 'Central African Republic', 'AF', 'None', 'bwgyr', 'star', ['CAR', 'Central Africa']],
  ['td', 'Chad', 'AF', 'Tricolor-Vertical Blue-Yellow-Red', 'byr', ''],
  ['cl', 'Chile', 'SA', 'None', 'rwb', 'star'],
  ['cn', 'China', 'AS', 'Red Field Emblem', 'ry', 'star', ["People's Republic of China", 'PRC']],
  ['co', 'Colombia', 'SA', 'Gran Colombia', 'ybr', ''],
  ['km', 'Comoros', 'AF', 'None', 'ywrbg', 'crescent star triangle'],
  ['cg', 'Republic of the Congo', 'AF', 'Diagonal Band', 'gyr', 'diagonal', ['Congo', 'Congo-Brazzaville', 'Congo Republic', 'Congo Brazzaville']],
  ['cd', 'Democratic Republic of the Congo', 'AF', 'Diagonal Band', 'byr', 'star diagonal', ['DR Congo', 'DRC', 'Congo-Kinshasa', 'Congo Kinshasa', 'Zaire', 'Congo']],
  ['cr', 'Costa Rica', 'NA', 'Five Stripes', 'bwr', 'emblem'],
  ['ci', "Côte d'Ivoire", 'AF', 'Tricolor-Vertical Green-White', 'owg', '', ['Ivory Coast', "Cote d'Ivoire"]],
  ['hr', 'Croatia', 'EU', 'Pan-Slavic', 'rwb', 'emblem', ['Hrvatska']],
  ['cu', 'Cuba', 'NA', 'Hoist Triangle', 'bwr', 'star triangle'],
  ['cy', 'Cyprus', 'EU', 'None', 'wog', 'map'],
  ['cz', 'Czechia', 'EU', 'Hoist Triangle', 'wrb', 'triangle', ['Czech Republic', 'Czech']],
  ['dk', 'Denmark', 'EU', 'Nordic Cross', 'rw', 'cross'],
  ['dj', 'Djibouti', 'AF', 'Hoist Triangle', 'bgwr', 'star triangle'],
  ['dm', 'Dominica', 'NA', 'None', 'gykwr', 'star cross circle animal'],
  ['do', 'Dominican Republic', 'NA', 'None', 'brw', 'cross emblem', ['Dominican Rep', 'DR']],
  ['ec', 'Ecuador', 'SA', 'Gran Colombia', 'ybr', 'emblem animal'],
  ['eg', 'Egypt', 'AF', 'Pan-Arab Horizontal', 'rwky', 'emblem animal'],
  ['sv', 'El Salvador', 'NA', 'Blue-White Stripes', 'bw', 'emblem', ['Salvador']],
  ['gq', 'Equatorial Guinea', 'AF', 'Hoist Triangle', 'gwrb', 'triangle emblem', ['Eq Guinea']],
  ['er', 'Eritrea', 'AF', 'Hoist Chevron', 'grby', 'triangle emblem'],
  ['ee', 'Estonia', 'EU', 'Tricolor-Horizontal', 'bkw', ''],
  ['sz', 'Eswatini', 'AF', 'None', 'byrkw', 'emblem', ['Swaziland']],
  ['et', 'Ethiopia', 'AF', 'Pan-African Horizontal', 'gyrb', 'star circle', ['Abyssinia']],
  ['fj', 'Fiji', 'OC', 'Union Jack Ensign', 'bwr', 'cross emblem'],
  ['fi', 'Finland', 'EU', 'Nordic Cross', 'wb', 'cross', ['Suomi']],
  ['fr', 'France', 'EU', 'Red-White-Blue Tricolor', 'bwr', ''],
  ['ga', 'Gabon', 'AF', 'Tricolor-Horizontal', 'gyb', ''],
  ['gm', 'Gambia', 'AF', 'Tricolor-Horizontal', 'rbgw', '', ['The Gambia']],
  ['ge', 'Georgia', 'AS', 'Red & White Cross', 'wr', 'cross', ['Sakartvelo']],
  ['de', 'Germany', 'EU', 'Black-Red-Gold', 'kry', '', ['Deutschland']],
  ['gh', 'Ghana', 'AF', 'Pan-African Horizontal', 'rygk', 'star'],
  ['gr', 'Greece', 'EU', 'Striped with Canton', 'bw', 'cross', ['Hellas']],
  ['gd', 'Grenada', 'NA', 'None', 'ryg', 'star circle'],
  ['gt', 'Guatemala', 'NA', 'Blue-White Stripes', 'bw', 'emblem animal'],
  ['gn', 'Guinea', 'AF', 'Pan-African Vertical', 'ryg', '', ['Guinea-Conakry']],
  ['gw', 'Guinea-Bissau', 'AF', 'Pan-African Vertical', 'rygk', 'star', ['Guinea Bissau']],
  ['gy', 'Guyana', 'SA', 'Hoist Chevron', 'gyrkw', 'triangle'],
  ['ht', 'Haiti', 'NA', 'Blue-Red Bicolor', 'br', 'emblem'],
  ['hn', 'Honduras', 'NA', 'Blue-White Stripes', 'bw', 'star'],
  ['hu', 'Hungary', 'EU', 'Tricolor-Horizontal Red-White-Green', 'rwg', '', ['Magyarorszag']],
  ['is', 'Iceland', 'EU', 'Nordic Cross', 'bwr', 'cross'],
  ['in', 'India', 'AS', 'Saffron-White-Green', 'owgb', 'circle', ['Bharat']],
  ['id', 'Indonesia', 'AS', 'Red-White Bicolor', 'rw', ''],
  ['ir', 'Iran', 'AS', 'Tricolor-Horizontal Red-White-Green', 'gwr', 'emblem', ['Persia']],
  ['iq', 'Iraq', 'AS', 'Pan-Arab Horizontal', 'rwkg', 'emblem'],
  ['ie', 'Ireland', 'EU', 'Tricolor-Vertical Green-White', 'gwo', '', ['Eire', 'Republic of Ireland']],
  ['il', 'Israel', 'AS', 'None', 'wb', 'star'],
  ['it', 'Italy', 'EU', 'Tricolor-Vertical Green-White', 'gwr', '', ['Italia']],
  ['jm', 'Jamaica', 'NA', 'Saltire', 'gyk', 'cross diagonal'],
  ['jp', 'Japan', 'AS', 'Disc', 'wr', 'circle', ['Nippon']],
  ['jo', 'Jordan', 'AS', 'Pan-Arab Triangle', 'kwgr', 'star triangle'],
  ['kz', 'Kazakhstan', 'AS', 'Sun', 'by', 'sun animal'],
  ['ke', 'Kenya', 'AF', 'Black-Red-Green Horizontal', 'krgw', 'emblem'],
  ['ki', 'Kiribati', 'OC', 'Sun', 'rybw', 'sun animal'],
  ['kw', 'Kuwait', 'AS', 'Pan-Arab Triangle', 'gwrk', 'triangle'],
  ['kg', 'Kyrgyzstan', 'AS', 'Red Field Emblem', 'ry', 'sun', ['Kyrgyz Republic', 'Kirghizia']],
  ['la', 'Laos', 'AS', 'Disc', 'rbw', 'circle', ['Lao PDR']],
  ['lv', 'Latvia', 'EU', 'Red-White-Red', 'rw', ''],
  ['lb', 'Lebanon', 'AS', 'Red-White-Red', 'rwg', 'emblem'],
  ['ls', 'Lesotho', 'AF', 'None', 'bwgk', 'emblem'],
  ['lr', 'Liberia', 'AF', 'Striped with Canton', 'rwb', 'star'],
  ['ly', 'Libya', 'AF', 'None', 'rkgw', 'crescent star'],
  ['li', 'Liechtenstein', 'EU', 'Blue-Red Bicolor', 'bry', 'emblem'],
  ['lt', 'Lithuania', 'EU', 'Pan-African Horizontal', 'ygr', ''],
  ['lu', 'Luxembourg', 'EU', 'Red-White-Blue Tricolor', 'rwb', ''],
  ['mg', 'Madagascar', 'AF', 'None', 'wrg', ''],
  ['mw', 'Malawi', 'AF', 'Black-Red-Green Horizontal', 'krg', 'sun'],
  ['my', 'Malaysia', 'AS', 'Striped with Canton', 'rwby', 'crescent star'],
  ['mv', 'Maldives', 'AS', 'Crescent & Star', 'rgw', 'crescent'],
  ['ml', 'Mali', 'AF', 'Pan-African Vertical', 'gyr', ''],
  ['mt', 'Malta', 'EU', 'Vertical Bicolor', 'wr', 'cross'],
  ['mh', 'Marshall Islands', 'OC', 'None', 'bow', 'star diagonal', ['Marshall Is']],
  ['mr', 'Mauritania', 'AF', 'Crescent & Star', 'gyr', 'crescent star'],
  ['mu', 'Mauritius', 'AF', 'Tricolor-Horizontal', 'rbyg', ''],
  ['mx', 'Mexico', 'NA', 'Tricolor-Vertical Green-White', 'gwr', 'emblem animal', ['Mexico']],
  ['fm', 'Micronesia', 'OC', 'Blue with Stars', 'bw', 'star', ['Federated States of Micronesia', 'FSM']],
  ['md', 'Moldova', 'EU', 'Tricolor-Vertical Blue-Yellow-Red', 'byr', 'emblem animal'],
  ['mc', 'Monaco', 'EU', 'Red-White Bicolor', 'rw', ''],
  ['mn', 'Mongolia', 'AS', 'None', 'rby', 'emblem'],
  ['me', 'Montenegro', 'EU', 'Double-Headed Eagle', 'ry', 'animal emblem', ['Crna Gora']],
  ['ma', 'Morocco', 'AF', 'Red Field Emblem', 'rg', 'star'],
  ['mz', 'Mozambique', 'AF', 'Hoist Chevron', 'gkyrw', 'star triangle emblem'],
  ['mm', 'Myanmar', 'AS', 'Pan-African Horizontal', 'ygrw', 'star', ['Burma']],
  ['na', 'Namibia', 'AF', 'Diagonal Band', 'brgwy', 'sun diagonal'],
  ['nr', 'Nauru', 'OC', 'Blue with Stars', 'byw', 'star'],
  ['np', 'Nepal', 'AS', 'None', 'rbw', 'sun crescent'],
  ['nl', 'Netherlands', 'EU', 'Red-White-Blue Tricolor', 'rwb', '', ['Holland', 'The Netherlands']],
  ['nz', 'New Zealand', 'OC', 'Union Jack Ensign', 'brw', 'star cross', ['Aotearoa', 'NZ']],
  ['ni', 'Nicaragua', 'NA', 'Blue-White Stripes', 'bw', 'emblem triangle'],
  ['ne', 'Niger', 'AF', 'Saffron-White-Green', 'owg', 'circle'],
  ['ng', 'Nigeria', 'AF', 'Tricolor-Vertical Green-White', 'gw', ''],
  ['kp', 'North Korea', 'AS', 'Five Stripes', 'brw', 'star circle', ['DPRK', 'Korea North', "Democratic People's Republic of Korea"]],
  ['mk', 'North Macedonia', 'EU', 'None', 'ry', 'sun', ['Macedonia', 'FYROM']],
  ['no', 'Norway', 'EU', 'Nordic Cross', 'rwb', 'cross', ['Norge']],
  ['om', 'Oman', 'AS', 'None', 'wrg', 'emblem'],
  ['pk', 'Pakistan', 'AS', 'Crescent & Star', 'gw', 'crescent star'],
  ['pw', 'Palau', 'OC', 'Disc', 'by', 'circle'],
  ['ps', 'Palestine', 'AS', 'Pan-Arab Triangle', 'kwgr', 'triangle', ['State of Palestine', 'Palestinian Territories']],
  ['pa', 'Panama', 'NA', 'None', 'wrb', 'star'],
  ['pg', 'Papua New Guinea', 'OC', 'None', 'rkyw', 'star animal diagonal', ['PNG', 'Papua']],
  ['py', 'Paraguay', 'SA', 'Red-White-Blue Tricolor', 'rwb', 'star emblem'],
  ['pe', 'Peru', 'SA', 'Red-White-Red', 'rw', '', ['Peru']],
  ['ph', 'Philippines', 'AS', 'Hoist Triangle', 'brwy', 'sun star triangle', ['Philippine', 'Pilipinas']],
  ['pl', 'Poland', 'EU', 'Red-White Bicolor', 'wr', '', ['Polska']],
  ['pt', 'Portugal', 'EU', 'Vertical Bicolor', 'gry', 'emblem'],
  ['qa', 'Qatar', 'AS', 'Serrated', 'rw', ''],
  ['ro', 'Romania', 'EU', 'Tricolor-Vertical Blue-Yellow-Red', 'byr', ''],
  ['ru', 'Russia', 'EU', 'Pan-Slavic', 'wbr', '', ['Russian Federation']],
  ['rw', 'Rwanda', 'AF', 'Sun', 'byg', 'sun'],
  ['kn', 'Saint Kitts and Nevis', 'NA', 'Diagonal Band', 'grkyw', 'star diagonal', ['Saint Kitts', 'St Kitts', 'Saint Christopher and Nevis']],
  ['lc', 'Saint Lucia', 'NA', 'None', 'bykw', 'triangle', ['St Lucia']],
  ['vc', 'Saint Vincent and the Grenadines', 'NA', 'Caribbean Vertical', 'byg', '', ['Saint Vincent', 'St Vincent', 'SVG']],
  ['ws', 'Samoa', 'OC', 'Red with Blue Canton', 'rbw', 'star', ['Western Samoa']],
  ['sm', 'San Marino', 'EU', 'None', 'wb', 'emblem'],
  ['st', 'São Tomé and Príncipe', 'AF', 'Hoist Chevron', 'gyrk', 'star triangle', ['Sao Tome', 'Sao Tome and Principe']],
  ['sa', 'Saudi Arabia', 'AS', 'None', 'gw', 'emblem', ['Saudi', 'KSA']],
  ['sn', 'Senegal', 'AF', 'Pan-African Vertical', 'gyr', 'star'],
  ['rs', 'Serbia', 'EU', 'Pan-Slavic', 'rbwy', 'emblem animal', ['Srbija']],
  ['sc', 'Seychelles', 'AF', 'None', 'byrwg', 'diagonal'],
  ['sl', 'Sierra Leone', 'AF', 'Tricolor-Horizontal', 'gwb', ''],
  ['sg', 'Singapore', 'AS', 'Red-White Bicolor', 'rw', 'crescent star'],
  ['sk', 'Slovakia', 'EU', 'Pan-Slavic', 'wbr', 'emblem cross', ['Slovak Republic']],
  ['si', 'Slovenia', 'EU', 'Pan-Slavic', 'wbry', 'emblem star'],
  ['sb', 'Solomon Islands', 'OC', 'Diagonal Band', 'bgyw', 'star diagonal', ['Solomons']],
  ['so', 'Somalia', 'AF', 'Blue with Stars', 'bw', 'star'],
  ['za', 'South Africa', 'AF', 'Hoist Chevron', 'rbgykw', 'triangle', ['RSA', 'SA']],
  ['kr', 'South Korea', 'AS', 'None', 'wrbk', 'circle', ['Korea', 'Republic of Korea', 'Korea South', 'ROK']],
  ['ss', 'South Sudan', 'AF', 'Black-Red-Green Horizontal', 'krgwby', 'star triangle'],
  ['es', 'Spain', 'EU', 'None', 'ry', 'emblem', ['Espana']],
  ['lk', 'Sri Lanka', 'AS', 'None', 'yogr', 'animal', ['Ceylon']],
  ['sd', 'Sudan', 'AF', 'Pan-Arab Triangle', 'rwkg', 'triangle'],
  ['sr', 'Suriname', 'SA', 'None', 'gwry', 'star', ['Surinam']],
  ['se', 'Sweden', 'EU', 'Nordic Cross', 'by', 'cross', ['Sverige']],
  ['ch', 'Switzerland', 'EU', 'Red & White Cross', 'rw', 'cross', ['Swiss Confederation', 'Schweiz', 'Suisse']],
  ['sy', 'Syria', 'AS', 'Pan-Arab Horizontal', 'rwkg', 'star', ['Syrian Arab Republic']],
  ['tw', 'Taiwan', 'AS', 'Red with Blue Canton', 'rbw', 'sun', ['Republic of China', 'ROC', 'Chinese Taipei', 'Formosa']],
  ['tj', 'Tajikistan', 'AS', 'Tricolor-Horizontal Red-White-Green', 'rwgy', 'star emblem'],
  ['tz', 'Tanzania', 'AF', 'Diagonal Band', 'gykb', 'diagonal'],
  ['th', 'Thailand', 'AS', 'Five Stripes', 'rwb', '', ['Siam']],
  ['tl', 'Timor-Leste', 'AS', 'Hoist Triangle', 'rykw', 'star triangle', ['East Timor', 'Timor Leste']],
  ['tg', 'Togo', 'AF', 'Striped with Canton', 'gyrw', 'star'],
  ['to', 'Tonga', 'OC', 'Red & White Cross', 'rw', 'cross'],
  ['tt', 'Trinidad and Tobago', 'NA', 'Diagonal Band', 'rwk', 'diagonal', ['Trinidad', 'Trinidad & Tobago']],
  ['tn', 'Tunisia', 'AF', 'Crescent & Star', 'rw', 'crescent star circle'],
  ['tr', 'Turkey', 'AS', 'Crescent & Star', 'rw', 'crescent star', ['Türkiye', 'Turkiye']],
  ['tm', 'Turkmenistan', 'AS', 'Central Asian Crescent', 'gwr', 'crescent star emblem'],
  ['tv', 'Tuvalu', 'OC', 'Union Jack Ensign', 'byrw', 'star cross'],
  ['ug', 'Uganda', 'AF', 'None', 'kyrw', 'animal circle'],
  ['ua', 'Ukraine', 'EU', 'None', 'by', '', ['Ukraina']],
  ['ae', 'United Arab Emirates', 'AS', 'Pan-Arab Triangle', 'rgwk', '', ['UAE', 'Emirates']],
  ['gb', 'United Kingdom', 'EU', 'Union Jack Ensign', 'brw', 'cross diagonal', ['UK', 'Great Britain', 'Britain', 'GB', 'United Kingdom of Great Britain and Northern Ireland']],
  ['us', 'United States', 'NA', 'Striped with Canton', 'rwb', 'star', ['USA', 'US', 'United States of America', 'America']],
  ['uy', 'Uruguay', 'SA', 'Striped with Canton', 'wby', 'sun'],
  ['uz', 'Uzbekistan', 'AS', 'Central Asian Crescent', 'bwgr', 'crescent star'],
  ['vu', 'Vanuatu', 'OC', 'Hoist Chevron', 'rgky', 'triangle emblem'],
  ['va', 'Vatican City', 'EU', 'Vertical Bicolor', 'ywr', 'emblem', ['Vatican', 'Holy See']],
  ['ve', 'Venezuela', 'SA', 'Gran Colombia', 'ybrw', 'star emblem'],
  ['vn', 'Vietnam', 'AS', 'Red Field Emblem', 'ry', 'star', ['Viet Nam']],
  ['ye', 'Yemen', 'AS', 'Pan-Arab Horizontal', 'rwk', ''],
  ['zm', 'Zambia', 'AF', 'None', 'grko', 'animal'],
  ['zw', 'Zimbabwe', 'AF', 'Hoist Chevron', 'gyrkw', 'star triangle animal'],
  ['xk', 'Kosovo', 'EU', 'Blue with Stars', 'byw', 'star map'],
]

const TERRITORY_ROWS: Row[] = [
  ['eh', 'Western Sahara', 'AF', 'Pan-Arab Triangle', 'kwgr', 'crescent star triangle', ['Sahrawi Republic', 'SADR', 'Sahrawi Arab Democratic Republic']],
  ['pr', 'Puerto Rico', 'NA', 'Hoist Triangle', 'rwb', 'star triangle', ['Porto Rico']],
  ['gl', 'Greenland', 'NA', 'Red-White Bicolor', 'wr', 'circle', ['Kalaallit Nunaat']],
  ['gb-eng', 'England', 'EU', 'Red & White Cross', 'wr', 'cross'],
  ['gb-sct', 'Scotland', 'EU', 'Saltire', 'bw', 'cross diagonal', ['Alba']],
  ['gb-wls', 'Wales', 'EU', 'Dragon', 'wgr', 'animal', ['Cymru']],
  ['hk', 'Hong Kong', 'AS', 'Red Field Emblem', 'rw', 'star', ['HK', 'Hongkong']],
  ['mo', 'Macau', 'AS', 'None', 'gwy', 'star', ['Macao']],
]

function toCountry(row: Row, isTerritory: boolean): Country {
  const [id, name, continentCode, similarityGroup, colorLetters, featureList, aliases = []] = row
  return {
    id,
    name,
    aliases: aliases.filter((a) => a !== name),
    continent: CONTINENT_BY_CODE[continentCode],
    flagUrl: `https://flagcdn.com/${id}.svg`,
    similarityGroup,
    colors: [...colorLetters].map((letter) => COLOR_BY_LETTER[letter]),
    features: featureList ? (featureList.split(' ') as FlagFeature[]) : [],
    isTerritory,
  }
}

export const flagsData: Country[] = [
  ...COUNTRY_ROWS.map((row) => toCountry(row, false)),
  ...TERRITORY_ROWS.map((row) => toCountry(row, true)),
].sort((a, b) => a.name.localeCompare(b.name))

export const SOVEREIGN_COUNT = COUNTRY_ROWS.length
