
import { Injectable } from '@angular/core';
// import * as Ipfs from 'ipfs';
// import * as ipfs from 'ipfs-js';

declare var Ipfs: {
    any: any
    (any): void
};

@Injectable()
export class IpfsService {

    public node = null;

    constructor() {

    }

    /**
     * Add buffercontent to IPFS
     */
    addBuffer(buffer: any, callback: any) {
      this.node.files.add(buffer, (err, filesAdded) => {
            if (err) {
                console.error('Error - ipfs files add', err);
                callback(null, 'Error', err);
            }
            let hashToShow = '';
            filesAdded.forEach((file) => {
                hashToShow = file.hash;
            });

            this.node.files.cat(hashToShow, function (error, data) {
                if (error) {
                    console.error('Error - ipfs files cat', error);
                    callback(null, 'Error', error);
                }
                callback(true, 'Success', hashToShow, data.toString());
            });
        });
    }

    /**
     * Add content to IPFS
     */
    add(message: string, callback: any) {
        this.node.files.add(new this.node.types.Buffer(message) , (err, filesAdded) => {
            if (err) {
                console.error('Error - ipfs files add', err);
                callback(null, 'Error', err);
            }
            let hashToShow = '';
            filesAdded.forEach((file) => {
                hashToShow = file.hash;
            });

            this.node.files.cat(hashToShow, function (error, data) {
                if (error) {
                    console.error('Error - ipfs files cat', error);
                    callback(null, 'Error', error);
                }
                callback(true, 'Success', hashToShow, data.toString());
            });
        });
    }

    get(hash, callback) {
       /* this.node.files.cat(hash, function (error, data) {
            if (error) {
                return console.error('Error - ipfs files cat', error);
            }
            console.log('returning from cat ' + hash, data.toString());
            callback(data.toString());
        });*/
    }

    initIpfs() {

        this.node = new Ipfs({
            repo: 'ipfs-' + Math.random(),
            config: {
                Addresses: {
                    Swarm: [
                        '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
                        '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
                        '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
                        '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
                        '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
                        '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
                        '/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
                        '/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6'
                    ]
                }
            }
        });
    }
}
