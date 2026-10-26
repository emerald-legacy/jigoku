describe('Magistrate\'s Intervention', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['magistrate-s-intervention'],
                    dynastyDiscard: ['young-rumormonger', 'doji-whisperer'],
                    conflictDiscard: ['cunning-magistrate']
                },
                player2: {
                    inPlay: ['akodo-toturi','matsu-berserker']
                }
            });
            this.intervention = this.player1.findCardByName('magistrate-s-intervention');
            this.rumor = this.player1.findCardByName('young-rumormonger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.cunning = this.player1.findCardByName('cunning-magistrate');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.zerk = this.player2.findCardByName('matsu-berserker');
            this.toturi.honor();
        });

        it('should not be able to be used outside of a conflict', function() {
            this.player1.moveCard(this.rumor, 'play area');
            this.player1.clickCard(this.intervention);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not be able to be used without a courtier', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [],
                type: 'military'
            });
            this.player1.clickCard(this.intervention);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should be able to be used with a courtier', function() {
            this.noMoreActions();
            this.player1.moveCard(this.whisperer, 'play area');
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [],
                type: 'military'
            });
            this.player1.clickCard(this.intervention);
            expect(this.player1).toHavePrompt('Magistrate\'s Intervention');
        });

        it('should be able to be used with a magistrate', function() {
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [],
                type: 'military'
            });
            this.player1.clickCard(this.intervention);
            expect(this.player1).toHavePrompt('Magistrate\'s Intervention');
        });

        it('should allow you to targt an attacking character', function() {
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [this.cunning],
                type: 'military'
            });
            this.player1.clickCard(this.intervention);
            expect(this.player1).toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.zerk);
            expect(this.player1).not.toBeAbleToSelect(this.cunning);
        });

        it('should dishonor the target', function() {
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [this.cunning],
                type: 'military'
            });
            this.player1.clickCard(this.intervention);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.isHonored).toBe(false);
            expect(this.toturi.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Magistrate\'s Intervention to dishonor Akodo Toturi');
        });

        it('should not be able to target an attacker that cannot be dishonored', function() {
            this.toturi.dishonor();
            this.toturi.dishonor();
            expect(this.toturi.isDishonored).toBe(true);
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi, this.zerk],
                defenders: [this.cunning],
                type: 'military'
            });
            this.player1.clickCard(this.intervention);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
            expect(this.player1).toBeAbleToSelect(this.zerk);
        });

        it('should dishonor the target twice if it is their second conflict against you', function() {
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [this.cunning],
                type: 'military'
            });
            this.toturi.bowed = true;
            this.noMoreActions();
            this.toturi.bowed = false;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [],
                type: 'political',
                ring: 'earth'
            });

            this.player1.clickCard(this.intervention);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.isHonored).toBe(false);
            expect(this.toturi.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays Magistrate\'s Intervention to dishonor Akodo Toturi, then dishonor it again');
        });

        it('should not count your conflicts (1 conflict)', function() {
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.initiateConflict({
                attackers: [this.cunning],
                defenders: [],
                type: 'military'
            });
            this.cunning.bowed = true;
            this.noMoreActions();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [],
                type: 'military'
            });

            this.player1.clickCard(this.intervention);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.isHonored).toBe(false);
            expect(this.toturi.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Magistrate\'s Intervention to dishonor Akodo Toturi');
        });

        it('should not count your conflicts (2 conflicts)', function() {
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.initiateConflict({
                attackers: [this.cunning],
                defenders: [],
                type: 'military'
            });
            this.cunning.bowed = true;
            this.noMoreActions();

            this.noMoreActions();
            this.player2.passConflict();
            this.cunning.bowed = false;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.cunning],
                defenders: [],
                type: 'political'
            });

            this.cunning.honor();
            this.player2.pass();
            this.player1.clickCard(this.intervention);
            this.player1.clickCard(this.cunning);
            expect(this.cunning.isHonored).toBe(false);
            expect(this.cunning.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Magistrate\'s Intervention to dishonor Cunning Magistrate');
        });

        it('should not count passed conflicts', function() {
            this.noMoreActions();
            this.player1.moveCard(this.cunning, 'play area');
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [this.cunning],
                type: 'military'
            });

            this.player1.clickCard(this.intervention);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.isHonored).toBe(false);
            expect(this.toturi.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Magistrate\'s Intervention to dishonor Akodo Toturi');
        });
    });
});

describe('Magistrate\'s Intervention and a redirected dishonor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['cunning-magistrate'],
                    hand: ['magistrate-s-intervention']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'kitsuki-shomon']
                }
            });
            this.intervention = this.player1.findCardByName('magistrate-s-intervention');
            this.cunning = this.player1.findCardByName('cunning-magistrate');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.shomon = this.player2.findCardByName('kitsuki-shomon');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [this.cunning],
                type: 'military'
            });
            this.toturi.bowed = true;
            this.noMoreActions();
            this.toturi.bowed = false;
            this.noMoreActions();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: [],
                type: 'political',
                ring: 'earth'
            });
        });

        it('does not dishonor again when the first dishonor was redirected', function() {
            this.player1.clickCard(this.intervention);
            this.player1.clickCard(this.toturi);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.shomon);
            expect(this.shomon.isDishonored).toBe(true);
            expect(this.toturi.isDishonored).toBe(false);
        });
    });
});

describe('Magistrate\'s Intervention on your own attacker', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'kakita-yoshi']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'doji-whisperer'],
                    hand: ['magistrate-s-intervention']
                }
            });
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.resolveConflict = () => {
                this.noMoreActions();
                for(let i = 0; i < 4; i++) {
                    for(const player of [this.player1, this.player2]) {
                        const prompt = player.currentPrompt();
                        if(prompt.buttons.some((button) => button.text === 'Don\'t resolve')) {
                            player.clickPrompt('Don\'t resolve');
                        } else if(prompt.menuTitle.startsWith('Do you wish to discard')) {
                            player.clickPrompt('No');
                        } else if(prompt.menuTitle.startsWith('Any reactions')) {
                            player.clickPrompt('Pass');
                        }
                    }
                }
                if(![this.player1, this.player2].some((player) => player.currentPrompt().menuTitle === 'Choose an elemental ring')) {
                    this.noMoreActions();
                }
            };
        });

        it('should not announce a second dishonor', function() {
            this.noMoreActions();
            this.initiateConflict({ attackers: ['doji-challenger'], defenders: [], type: 'military', ring: 'air' });
            this.resolveConflict();
            this.initiateConflict({ attackers: ['akodo-toturi'], defenders: [], type: 'military', ring: 'earth' });
            this.resolveConflict();
            this.initiateConflict({ attackers: ['kakita-yoshi'], defenders: [], type: 'political', ring: 'fire', province: this.player2.provinces['province 2'].provinceCard });
            this.resolveConflict();
            this.initiateConflict({ attackers: [this.whisperer], defenders: [], type: 'political', ring: 'water', province: this.player1.provinces['province 2'].provinceCard });

            this.player1.pass();
            this.player2.clickCard('magistrate-s-intervention');
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 plays Magistrate\'s Intervention to dishonor Doji Whisperer');
        });
    });
});
