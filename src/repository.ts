import axios from "axios";
import * as fs from "fs";
import {Asset, Release, Author} from "./HTTPResponseTypes"

export type RepoArgs = {
    token?: string;
    repository: string;
};

export type ConvertedRelease = {
    url: string;
    assetsUrl: string;
    id: number;
    tagName: string;
    name: string;
    createdAt: Date;
    publishedAt: Date;
    assets: Array<{
        url: string;
        id: number;
        name: string;
        contentType: string;
        state: string;
        size: number;
        createdAt: Date
        updatedAt: Date
        browserDownloadUrl: string;
        download: (path?: string|true) => Promise<Buffer|string|undefined>;
    }>;
    tarballUrl: string;
    zipballUrl: string;
    body: string;
}

export { Asset, Release, Author };

export default class Repository {
    token?: string;
    repository: string;
    releasesUrl: string;
    headers: any;

    constructor(args: RepoArgs) {
        const { token, repository } = args;
        this.token = token;
        this.repository = repository;
        this.releasesUrl = `https://api.github.com/repos/${this.repository}/releases`;

        this.headers = typeof this.token === 'string' ? {
            Authorization: `Bearer ${this.token}`
        } : {}
    }

    async getReleasesInfo(): Promise<ConvertedRelease[]> {
        const response = await axios.get<Release[]>(this.releasesUrl, {
            headers: { ...this.headers }
        });
        if (response.status === 200) {
            const releases: ConvertedRelease[] = [];
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
                })
            })
            return releases;
        }
        return [];
    }

    async downloadAsset(asset: Asset, path?: string|boolean): Promise<Buffer|string|undefined> {
        const response = await axios.get(asset.url, {
            headers: {
                ...this.headers,
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
                        if (err) reject(err)
                        else resolve(typeof path === 'string' ? path : asset.name)
                    })
                }))
            } else
                return Buffer.from(response.data, 'binary');
        } else {
            return undefined;
        }
    }
}