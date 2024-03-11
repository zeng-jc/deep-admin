// 请求响应参数（不包含data）
export interface Result {
  code: string;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pagenum: number;
  pagesize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pagenum: number;
  pagesize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    token: string;
    userInfo: {
      nickname: string;
    };
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
}

// role 管理
export namespace Role {
  export interface ReqRoleParams {
    name: string;
  }
  export interface ResRoleList {
    id: string;
    name: string;
    status: number;
    desc: string;
    createAt: string;
    permissions: [];
  }
}

export namespace Stats {
  export interface ResStats {
    user: {
      total: number;
      todayCount: number;
    };
    moment: {
      total: number;
      commentCount: number;
      likesCount: number;
      viewsCount: number;
    };
    article: {
      total: number;
      commentCount: number;
      likesCount: number;
      viewsCount: number;
    };
    visits: {
      today: number;
      yesterday: number;
      total: number;
    };
    questionAnswer: {
      questionTotal: number;
    };
  }
}
