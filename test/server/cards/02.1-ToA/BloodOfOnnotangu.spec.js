describe('Blood of Onnotangu', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: [{ card: 'doji-challenger', attachments: ['scarlet-sabre'] }],
                    hand: ['kakita-blade']
                },
                player2: {
                    provinces: ['blood-of-onnotangu']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.blood = this.player2.findCardByName('blood-of-onnotangu');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.blood,
                attackers: [this.challenger],
                defenders: []
            });
        });

        it('doesn\'t stop a player from losing fate, only from spending it (EmeraldDB ruling)', function () {
            const fate = this.player2.fate;
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.challenger);
            expect(this.player2.fate).toBe(fate - 1);
        });

        it('stops a player from spending fate during a conflict at this province', function () {
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard('kakita-blade');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.findCardByName('kakita-blade').location).toBe('hand');
            expect(this.player1.fate).toBe(5);
        });
    });
});

describe('Blood of Onnotangu during a conflict at another province', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['doji-challenger', 'kaiu-envoy'],
                    hand: ['kakita-blade']
                },
                player2: {
                    provinces: {
                        'province 1': {
                            provinceCard: 'blood-of-onnotangu'
                        },
                        'province 2': {
                            provinceCard: 'shameful-display'
                        }
                    }
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.envoy = this.player1.findCardByName('kaiu-envoy');
            this.blade = this.player1.findCardByName('kakita-blade');
            this.blood = this.player2.findCardByName('blood-of-onnotangu');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                province: this.blood,
                attackers: [this.envoy],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t resolve');
            this.noMoreActions();
            expect(this.getChatLogs(1)).toContain('player2 passes their conflict opportunity as none of their characters can be declared as an attacker');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                province: this.otherProvince,
                attackers: [this.challenger],
                defenders: []
            });
        });

        it('lets a player spend fate', function () {
            expect(this.blood.facedown).toBe(false);
            expect(this.blood.isBroken).toBe(false);
            this.player2.pass();
            this.player1.playAttachment(this.blade, this.challenger);
            expect(this.challenger.attachments).toContain(this.blade);
            expect(this.player1.fate).toBe(4);
        });
    });
});
