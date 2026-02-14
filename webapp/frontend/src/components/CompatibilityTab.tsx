"use client";

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const fonts = {
    serif: "var(--font-noto-serif-jp), 'Noto Serif JP', serif",
    mono: "var(--font-dm-mono), 'DM Mono', monospace",
};

interface PersonInput {
    birthday: string;
    gender: 'M' | 'F';
    nickname: string;
}

interface CompatibilityTabProps {
    isDesktop: boolean;
}

export function CompatibilityTab({ isDesktop }: CompatibilityTabProps) {
    const { t, isDark } = useTheme();

    const [personA, setPersonA] = useState<PersonInput>({ birthday: '', gender: 'M', nickname: '' });
    const [personB, setPersonB] = useState<PersonInput>({ birthday: '', gender: 'F', nickname: '' });
    const [relationship, setRelationship] = useState('');
    const [loading, setLoading] = useState(false);

    const formatBirthday = (value: string) => {
        let v = value.replace(/[^\d]/g, '');
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length >= 5) v = v.slice(0, 4) + '-' + v.slice(4);
        if (v.length >= 8) v = v.slice(0, 7) + '-' + v.slice(7);
        return v;
    };

    const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);
    const canSubmit = isValidDate(personA.birthday) && isValidDate(personB.birthday) && !loading;

    const handleSubmit = () => {
        // Phase 2-2 で API 連携予定
        alert('相性鑑定機能は次のアップデートで実装予定です');
    };

    // Shared field styles
    const inputStyle = {
        width: "100%",
        background: t.inputBg,
        border: `1px solid ${t.inputBorder}`,
        borderRadius: 0,
        padding: "10px 12px",
        color: t.text1,
        fontFamily: fonts.serif,
        fontSize: 15,
        outline: "none",
        transition: "all 0.3s",
        boxSizing: "border-box" as const,
    };

    const labelStyle = {
        display: "block",
        fontSize: 10,
        color: t.text4,
        letterSpacing: 2,
        fontFamily: fonts.serif,
        marginBottom: 6,
    };

    const personCard = (person: PersonInput, setPerson: (p: PersonInput) => void, label: string, placeholder: string) => (
        <div style={{
            flex: 1,
            minWidth: 260,
        }}>
            {/* Person label */}
            <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: t.text2,
                fontFamily: fonts.serif,
                letterSpacing: 4,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}>
                <span style={{
                    width: 24, height: 24,
                    border: `1.5px solid ${t.vermillion}`,
                    borderRadius: 2,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: t.vermillion, fontWeight: 700,
                    fontFamily: fonts.serif,
                    background: t.vermillionBg,
                }}>{label}</span>
                {person.nickname || placeholder}
            </div>

            {/* Nickname */}
            <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>ニックネーム（任意）</label>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={person.nickname}
                    onChange={(e) => setPerson({ ...person, nickname: e.target.value })}
                    style={inputStyle}
                />
            </div>

            {/* Birthday */}
            <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>生年月日</label>
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1990-01-01"
                    value={person.birthday}
                    onChange={(e) => setPerson({ ...person, birthday: formatBirthday(e.target.value) })}
                    maxLength={10}
                    style={inputStyle}
                />
            </div>

            {/* Gender */}
            <div>
                <label style={labelStyle}>性別</label>
                <div style={{ display: "flex", border: `1px solid ${t.inputBorder}`, background: t.inputBg }}>
                    {(["M", "F"] as const).map((g) => (
                        <button
                            key={g}
                            onClick={() => setPerson({ ...person, gender: g })}
                            style={{
                                flex: 1,
                                padding: "10px 0",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 14,
                                fontFamily: fonts.serif,
                                fontWeight: person.gender === g ? 600 : 300,
                                color: person.gender === g ? t.activeChipText : t.text3,
                                background: person.gender === g ? t.activeChip : "transparent",
                                transition: "all 0.2s",
                            }}
                        >
                            {g === "M" ? "男性" : "女性"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: isDesktop ? "24px 32px 80px" : "20px 16px 120px", maxWidth: isDesktop ? "none" : 600, margin: "0 auto" }}>
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>
                相性診断
            </div>

            <div style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 2,
                padding: "24px",
                boxShadow: t.shadowCard,
                transition: "all 0.3s",
            }}>
                {/* Two person inputs */}
                <div style={{
                    display: "flex",
                    flexDirection: isDesktop ? "row" : "column",
                    gap: isDesktop ? 32 : 24,
                    marginBottom: 24,
                }}>
                    {personCard(personA, setPersonA, "A", "Aさん")}

                    {/* Divider */}
                    {isDesktop ? (
                        <div style={{
                            width: 1,
                            background: t.border,
                            alignSelf: "stretch",
                        }} />
                    ) : (
                        <div style={{
                            height: 1,
                            background: t.border,
                            width: "100%",
                        }} />
                    )}

                    {personCard(personB, setPersonB, "B", "Bさん")}
                </div>

                {/* Relationship */}
                <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>関係性</label>
                    <input
                        type="text"
                        placeholder="例: 恋人、夫婦、ビジネスパートナー、友人..."
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    style={{
                        width: "100%",
                        padding: "13px 0",
                        border: `1.5px solid ${t.text1}`,
                        borderRadius: 0,
                        cursor: canSubmit ? "pointer" : "default",
                        fontSize: 15,
                        fontWeight: 600,
                        fontFamily: fonts.serif,
                        letterSpacing: 4,
                        color: t.text1,
                        background: "transparent",
                        transition: "all 0.2s",
                        opacity: canSubmit ? 1 : 0.4,
                    }}
                >
                    {loading ? '鑑定中...' : '相性を鑑定する'}
                </button>
            </div>
        </div>
    );
}
