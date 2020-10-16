"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
class Repository {
    constructor(args) {
        const { token, repository } = args;
        this.token = token;
        this.repository = repository;
        this.releasesUrl = `https://api.github.com/repos/${this.repository}/releases`;
    }
    async getReleasesInfo() {
        const response = await axios_1.default.get(this.releasesUrl, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        if (response.status === 200) {
            const releases = [];
            response.data.map(release => {
                releases.push({
                    url: release.url,
                    assetsUrl: release.assets_url,
                    id: release.id,
                    tagName: release.tag_name,
                    name: release.name,
                    createdAt: release.created_at,
                    publishedAt: release.published_at,
                    assets: release.assets.map(asset => ({
                        url: asset.url,
                        id: asset.id,
                        name: asset.name,
                        contentType: asset.content_type,
                        state: asset.state,
                        size: asset.size,
                        createdAt: asset.created_at,
                        updatedAt: asset.updated_at,
                        browserDownloadUrl: asset.browser_download_url,
                        download: this.downloadAsset.bind(this, asset)
                    })),
                    tarballUrl: release.tarball_url,
                    zipballUrl: release.zipball_url,
                    body: release.body
                });
            });
            return releases;
        }
        return [];
    }
    async downloadAsset(asset, path) {
        const response = await axios_1.default.get(asset.url, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                Accept: 'application/octet-stream'
            },
            responseType: 'arraybuffer',
            validateStatus: () => true
        });
        if (response.status === 200) {
            if (typeof path !== 'undefined') {
                const buffer = Buffer.from(response.data, 'binary');
                return await (new Promise((resolve, reject) => {
                    fs.writeFile(typeof path === 'string' ? path : asset.name, buffer, (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve(typeof path === 'string' ? path : asset.name);
                    });
                }));
            }
            else
                return Buffer.from(response.data, 'binary');
        }
        else {
            return undefined;
        }
    }
}
exports.default = Repository;
